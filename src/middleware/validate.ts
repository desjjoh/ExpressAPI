import { ZodError, z, type ZodTypeAny } from "zod";
import type { Request, Response, NextFunction } from "express";

import { BadRequestError } from "@/utils/http-error.js";

export function validate<
  T extends ZodTypeAny,
  K extends "body" | "query" | "params",
>(schema: T, source: K) {
  return (
    req: Request & Record<K, z.output<T>>,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      const parsed = schema.parse(req[source] as unknown as z.input<T>);
      (req[source] as unknown) = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues.map((issue) => issue.message).join(", ");
        next(new BadRequestError(`Validation failed: ${message}`));
      } else {
        next(err);
      }
    }
  };
}
