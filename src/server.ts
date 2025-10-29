import { env, isDev } from '@/config/env-validation';
import { swaggerDocs } from '@/config/swagger';
import { logger } from '@/logger/logger';
import { errorHandler } from '@/middleware/error-handler';
import users from '@/routes/users';

import express from 'express';
import pinoHttp from 'pino-http';

const app = express();
const port = env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp({ logger, quietReqLogger: !isDev }));
app.use('/docs', ...swaggerDocs);

app.use('/users', users);
app.use(errorHandler);

app.listen(port, () => {
  const mode = isDev ? 'development' : 'production';
  logger.info({ port: env.PORT }, `Server running in ${mode} mode at http://localhost:${port}`);
  logger.info(`Swagger docs available at http://localhost:${env.PORT}/docs`);
});
