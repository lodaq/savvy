import express, { Request, Response } from 'express';
import Share from '../models/shares';

const store = new Share();

const index = async (_req: Request, res: Response) => {
  try {
    const posts = await store.index();
    res.json(posts);
  } catch (error) {
    res.status(400).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const post = await store.show(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createText = async (req: Request, res: Response) => {
  try {
    const text = req.body.text;
    console.log(`here`, text);
    const newPost = await store.createText(text);
    console.log(newPost);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
};

const createVideo = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const newPost = await store.createVideo(url);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createQuote = async (req: Request, res: Response) => {
  try {
    const quote = req.body.quote;
    const newPost = await store.createQuote(quote);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createImage = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const newPost = await store.createImage(url);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createShort = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const newPost = await store.createShort(url);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createLink = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const newPost = await store.createLink(url);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(deleted);
  } catch (error) {
    res.status(500).json(error);
  }
};

const shareRoutes = (app: express.Application) => {
  app.get('/shares', index);
  app.get('/shares/:id', show);
  app.post('/shares/text', createText);
  app.post('/shares/video', createVideo);
  app.post('/shares/quote', createQuote);
  app.post('/shares/image', createImage);
  app.post('/shares/short', createShort);
  app.post('/shares/link', createLink);
  app.delete('/shares/:id', destroy);
};

export default shareRoutes;
