import { createApp } from '@/app';
import { env, isDev } from '@/config/env-validation';
import { logger } from '@/logger/logger';
import { SystemLifecycle } from './system/lifecycle';

const app = createApp();
const start = performance.now();

const server = app.listen(env.PORT, () => {
  const mode = isDev ? 'development' : 'production';
  logger.info({ port: env.PORT }, `Server running in ${mode} mode at http://localhost:${env.PORT}`);
  logger.info(`Swagger docs available at http://localhost:${env.PORT}/docs`);
});

SystemLifecycle.register(server, start);
