import { performance } from 'node:perf_hooks';
import { prisma } from '@/db/prisma';
import { logger } from '@/logger/logger';

export class SystemLifecycle {
  private static shutdownStarted = false;

  public static register(server: import('http').Server, start = performance.now()): void {
    const context = 'SystemLifecycle';

    const shutdown = async (signal: string): Promise<void> => {
      if (this.shutdownStarted) return;
      this.shutdownStarted = true;

      const initiated = performance.now();
      const uptime = (initiated - start).toFixed(2);
      logger.warn(
        { context, signal, uptime },
        `[exit] ${signal} received — initiating graceful shutdown`,
      );

      try {
        await new Promise<void>((resolve, reject) => {
          server.close(err => {
            if (err) return reject(err);
            logger.info({ context }, '[exit] HTTP server closed');
            resolve();
          });
        });

        await prisma.$disconnect();
        logger.info({ context }, '[exit] Prisma disconnected');

        const duration = (performance.now() - initiated).toFixed(2);
        logger.info({ context, duration }, `[exit] shutdown complete in ${duration}ms`);
        process.exit(0);
      } catch (err) {
        logger.error(
          { context, reason: err instanceof Error ? err.message : String(err) },
          '[exit] error during shutdown — forcing exit',
        );
        process.exit(1);
      }
    };

    ['SIGINT', 'SIGTERM'].forEach(sig => {
      process.once(sig, () => void shutdown(sig));
    });

    process.once('beforeExit', code => {
      const duration = (performance.now() - start).toFixed(2);
      logger.info({ context, code, duration }, `[exit] process exiting after ${duration}ms`);
    });
  }
}
