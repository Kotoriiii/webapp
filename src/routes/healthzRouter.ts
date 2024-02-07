import express from 'express';
import { PrismaClient } from '@prisma/client';
import add405ResponseToRouter from 'src/utils/405Routes';
const router = express.Router();

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    res.status(400).send();
  }

  try {
    await prisma.$connect();
    res.status(200).send();
    await prisma.$disconnect();
  } catch (err) {
    res.status(503).send();
  }
});

export default add405ResponseToRouter(router);
