import { env, isDev } from "@/config/env-validation";
import { logger } from "@/logger/index";
import { errorHandler } from "@/middleware/error-handler";
import users from "@/routes/users";

import express, { Request, Response } from "express";
import pinoHttp from "pino-http";

const app = express();
const port = env.PORT;

app.use(express.json());
app.use(pinoHttp({ logger, quietReqLogger: !isDev }));

app.use("/users", users);
app.get("/", (_: Request, res: Response) => {
  res.send(`Hello from ${env.NODE_ENV} mode on port ${port}`);
});

app.use(errorHandler);
app.listen(port, () => {
  const mode = isDev ? "development" : "production";
  logger.info(
    { port: env.PORT },
    `Server running in ${mode} mode at http://localhost:${port}`,
  );
});
