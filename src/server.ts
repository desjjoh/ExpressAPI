import { env, isDev } from '@/config/env-validation';
import { swaggerDocs } from '@/config/swagger';
import { prisma } from '@/db/prisma';
import { logger } from '@/logger/logger';
import { errorHandler } from '@/middleware/error-handler';
import users from '@/routes/users';

import express from 'express';
import pinoHttp from 'pino-http';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();
const port = env.PORT;

app.set('trust proxy', 1);

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
      req.app.locals.logger?.warn(
        {
          ip: req.ip,
          url: req.originalUrl,
        },
        'Rate limit triggered',
      );
      res.status(options.statusCode).json(options.message);
    },
  }),
);

app.use((req, _res, next) => {
  if (!isDev) return next();
  logger.debug({ ip: req.ip, ua: req.headers['user-agent'] }, 'debug: request context');
  next();
});

app.use(pinoHttp({ logger, quietReqLogger: !isDev }));
app.use('/docs', ...swaggerDocs);

app.use('/users', users);
app.use(errorHandler);

const server = app.listen(port, () => {
  const mode = isDev ? 'development' : 'production';
  logger.info({ port: env.PORT }, `Server running in ${mode} mode at http://localhost:${port}`);
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
