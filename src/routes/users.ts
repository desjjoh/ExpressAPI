import { Router } from "express";
import { z } from "zod";
import { validate } from "@/middleware/validate.js";
import { NotFoundError } from "@/utils/http-error.js";

const router = Router();

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

router.post("/", validate(CreateUserSchema, "query"), (req, res) => {
  const { email, name } = req.body;
  res.status(201).json({ message: "User created", email, name });
});

router.get("/:id", (req, res, next) => {
  if (req.params.id !== "1") return next(new NotFoundError());
  res.json({ id: 1, name: "John Doe" });
});

export default router;
