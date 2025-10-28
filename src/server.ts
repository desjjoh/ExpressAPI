import { env, isDev } from "@/config/env-validation";
import express, { Request, Response } from "express";

const app = express();
const port = env.PORT;

app.get("/", (_: Request, res: Response) => {
  res.send(`Hello from ${env.NODE_ENV} mode on port ${port}`);
});

app.listen(port, () => {
  const mode = isDev ? "development" : "production";
  console.log(`Server running in ${mode} mode at http://localhost:${port}`);
});
