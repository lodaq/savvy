import express, { Request, Response } from 'express';
import { Post } from '../models/posts';

const store = new Post();

const index = async (_req: Request, res: Response) => {
  const posts = await store.index();
  res.json(posts);
};

const show = async (req: Request, res: Response) => {
  const post = await store.show(req.params.id);
  res.json(post);
};

const create = async (req: Request, res: Response) => {
  try {
    const post = {
      text: req.body.text,
    };

    const newpost = await store.create(post.text);
    res.json(newpost);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const postRoutes = (app: express.Application) => {
  app.get('/posts', index);
  app.get('/posts/:id', show);
  app.post('/posts', create);
  app.delete('/posts/:id', destroy);
};

export default postRoutes;
