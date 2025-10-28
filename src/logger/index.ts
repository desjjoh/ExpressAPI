import pino from "pino";
import { env, isDev } from "@/config/env-validation";

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isDev
    ? { target: "pino-pretty", options: { singleLine: true, colorize: true } }
    : undefined,
  base: { service: "quickapi-express" },
  timestamp: pino.stdTimeFunctions.isoTime,
});
