import type { ErrorRequestHandler } from "express";
import { HttpError } from "@/utils/http-error.js";
import { logger } from "@/logger/index.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  void next;
  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof HttpError ? err.message : "Internal Server Error";

  logger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl,
      requestId: res.locals.requestId,
    },
    "Request failed",
  );

  res.status(status).json({
    status,
    message,
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString(),
  });
};
