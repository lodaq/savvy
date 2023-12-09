import express, { Request, Response } from 'express';
import { User, UserType } from '../models/users';

const store = new User();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: UserType = req.body;
    const user = { username, email, password };
    const userCreated = await store.create(user);
    res.json(userCreated);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedUser = await store.delete(req.body.id);
    res.json(deletedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserType = req.body;
    console.log(`auth 1`);
    const authenticatedUser = await store.authenticate(email, password);
    res.json(authenticatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

const postRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.delete('/users/:id', destroy);
};

export default postRoutes;
