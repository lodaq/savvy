import express, { Request, Response } from 'express';
import ogs from 'open-graph-scraper';
import Share from '../models/shares';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';

const index = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const posts = await store.index();
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(sortedPosts);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createText = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { text, caption } = req.body;
    const newPost = await store.createText(text, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const updateText = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { _id, text, caption } = req.body;
    const newPost = await store.updateText(_id, text, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const createVideo = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { url, caption } = req.body;
    const newPost = await store.createVideo(url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateVideo = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { _id, url, caption } = req.body;
    const newPost = await store.updateVideo(_id, url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const createQuote = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { quote, caption, author } = req.body;
    const newPost = await store.createQuote(quote, caption, author);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateQuote = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { _id, quote, author, caption } = req.body;
    const newPost = await store.updateQuote(_id, quote, author, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const createImage = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { url, caption } = req.body;
    const newPost = await store.createImage(url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateImage = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { _id, url, caption } = req.body;
    const newPost = await store.updateImage(_id, url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const createShort = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { url, caption } = req.body;
    const newPost = await store.createShort(url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateShort = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { _id, url, caption } = req.body;
    const newPost = await store.updateShort(_id, url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const createLink = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { url, caption } = req.body;
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

const updateLink = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const { _id, url, caption } = req.body;
    const newPost = await store.updateLink(_id, url, caption);
    res.json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request: ' + error });
  }
};

const likePost = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
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

const destroy = async (req: RequireAuthProp<Request>, res: Response) => {
  try {
    const store = new Share(req.auth.userId);
    const deleted = await store.delete(req.params.id.toString());
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

  app.post('/shares/text', createText);
  app.patch('/shares/text', updateText);

  app.post('/shares/video', createVideo);
  app.patch('/shares/video', updateVideo);

  app.post('/shares/quote', createQuote);
  app.patch('/shares/quote', updateQuote);

  app.post('/shares/image', createImage);
  app.patch('/shares/image', updateImage);

  app.post('/shares/short', createShort);
  app.patch('/shares/short', updateShort);

  app.post('/shares/link', createLink);
  app.patch('/shares/link', updateLink);

  app.put('/shares/like/:id', likePost);
  app.delete('/shares/delete/:id', destroy);
};

export default shareRoutes;
