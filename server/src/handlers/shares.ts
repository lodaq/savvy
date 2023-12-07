import express, { Request, Response } from 'express';
import ogs from 'open-graph-scraper';
import Share from '../models/shares';

const store = new Share();

const index = async (_req: Request, res: Response) => {
  try {
    const posts = await store.index();
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    console.log(sortedPosts);
    res.json(sortedPosts);
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
    const caption = req.body.caption;
    const newPost = await store.createText(text, caption);
    console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.log('error happened');
    res.status(400).json({ error: 'Bad Request' });
  }
};

const createVideo = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const caption = req.body.caption;
    const newPost = await store.createVideo(url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createQuote = async (req: Request, res: Response) => {
  try {
    const quote = req.body.quote;
    const caption = req.body.caption;
    const newPost = await store.createQuote(quote, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createImage = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const caption = req.body.caption;
    const newPost = await store.createImage(url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createShort = async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    const caption = req.body.caption;
    const newPost = await store.createShort(url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createLink = async (req: Request, res: Response) => {
  try {
    const url: string = req.body.url;
    const caption = req.body.caption;
    const {
      result: { ogDescription, ogTitle, ogImage, favicon },
    } = await ogs({ url });
    const newPost = await store.createLink(
      {
        url,
        favicon,
        ogTitle,
        ogDescription,
        ogImage: JSON.stringify(ogImage),
      },
      caption,
    );
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const likePost = async (req: Request, res: Response) => {
  try {
    const post = await store.likePost(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json(error);
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
  app.put('/shares/like/:id', likePost);
  app.delete('/shares/:id', destroy);
};

export default shareRoutes;
