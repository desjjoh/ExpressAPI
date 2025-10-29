import { createApp } from '@/app';
import { env, isDev } from '@/config/env-validation';
import { prisma } from '@/db/prisma';
import { logger } from '@/logger/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  const mode = isDev ? 'development' : 'production';
  logger.info({ port: env.PORT }, `Server running in ${mode} mode at http://localhost:${env.PORT}`);
  logger.info(`Swagger docs available at http://localhost:${env.PORT}/docs`);
});

async function shutdown(signal: string) {
  logger.warn(`${signal} received — starting graceful shutdown...`);

  try {
    await new Promise<void>(resolve => {
      server.close(() => {
        logger.info('HTTP server closed.');
        resolve();
      });
    });

    await prisma.$disconnect();
    logger.info('Prisma disconnected.');
    logger.info('Shutdown complete — exiting.');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during shutdown — forcing exit.');
    process.exit(1);
  }
}

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => void shutdown(sig)));
