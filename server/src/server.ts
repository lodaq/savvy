import express from 'express';
import cors from 'cors';
// import { Post } from './models/posts';
// import articleRoutes from './handlers/articles';
// import postsRoutes from './handlers/posts';
import { configDotenv } from 'dotenv';
import Client from './database';

configDotenv();

const app: express.Application = express();
const port: number = +process.env.PORT || 3000;
// const posts = new Post();
const corsOptions: cors.CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

const getPosts = async () => {
  try {
    const conn = await Client.connect();
    const query = 'SELECT * FROM posts';
    const result = await conn.query(query);
    conn.release();
    return result.rows;
  } catch (error) {
    throw new Error(`Could not get the posts. Erorr: ${error}`);
  }
};

/* articleRoutes(app);
postsRoutes(app); */

app.get('/posts', async (_req, res) => {
  const posts = await getPosts();

  res.json(posts);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
