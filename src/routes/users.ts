import { Router } from 'express';
import { validate } from '@/middleware/validate.js';
import { NotFoundError } from '@/utils/http-error.js';
import { prisma } from '@/db/prisma';
import { CreateUserSchema } from '@/schemas/user.schema';

const router = Router();

router.post('/', validate(CreateUserSchema), async (req, res) => {
  const { email, name } = req.body;

  const user = await prisma.user.create({
    data: { name, email },
  });

  res.status(201).json({ message: 'User created', user });
});

router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return next(new NotFoundError('Invalid user ID'));

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return next(new NotFoundError('User not found'));
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
