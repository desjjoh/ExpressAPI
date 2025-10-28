import { env, isDev } from "@/config/env-validation";
import { logger } from "@/logger/index";
import { errorHandler } from "@/middleware/error-handler.js";

import express, { Request, Response } from "express";
import pinoHttp from "pino-http";

const app = express();
const port = env.PORT;

app.use(pinoHttp({ logger, quietReqLogger: !isDev }));
app.use(errorHandler);

app.get("/", (_: Request, res: Response) => {
  res.send(`Hello from ${env.NODE_ENV} mode on port ${port}`);
});

app.listen(port, () => {
  const mode = isDev ? "development" : "production";
  logger.info(
    { port: env.PORT },
    `Server running in ${mode} mode at http://localhost:${port}`,
  );
});
