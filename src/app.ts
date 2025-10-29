import express from 'express';
import pinoHttp from 'pino-http';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { isDev } from '@/config/env-validation';
import { swaggerDocs } from '@/config/swagger';
import { logger } from '@/logger/logger';
import { errorHandler } from '@/middleware/error-handler';

import users from '@/routes/users';
import health from '@/routes/health';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(pinoHttp({ logger, quietReqLogger: !isDev }));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(
    cors({
      origin: ['*'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
  );

  app.use(compression());

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: isDev ? 1000 : 200,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        status: 429,
        message: 'Too many requests — please slow down.',
      },
      handler: (req, res, _next, options) => {
        req.app.locals.logger?.warn({ ip: req.ip, url: req.originalUrl }, 'Rate limit triggered');
        res.status(options.statusCode).json(options.message);
      },
    }),
  );

  if (isDev)
    app.use((req, _res, next) => {
      logger.debug({ ip: req.ip, ua: req.headers['user-agent'] }, 'debug: request context');
      next();
    });

  app.use('/docs', ...swaggerDocs);

  app.use('/', health);
  app.use('/users', users);

  app.use(errorHandler);

  return app;
}
