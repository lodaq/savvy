import express from 'express';
import cors from 'cors';
// import { Post } from './models/posts';
import articleRoutes from './handlers/articles';
import postsRoutes from './handlers/posts';
import { configDotenv } from 'dotenv';
import shareRoutes from './handlers/shares';
import bodyParser from 'body-parser';

configDotenv();

const app: express.Application = express();
const port: number = +process.env.PORT || 3000;
// const posts = new Post();
const corsOptions: cors.CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

/* const getPosts = async () => {
  try {
    const conn = await Client.connect();
    const query = 'SELECT * FROM posts';
    const result = await conn.query(query);
    conn.release();
    return result.rows;
  } catch (error) {
    throw new Error(`Could not get the posts. Erorr: ${error}`);
  }
}; */

articleRoutes(app);
postsRoutes(app);
shareRoutes(app);

/* app.get('/posts', async (_req, res) => {
  const posts = await getPosts();

  res.json(posts);
}); */

app.get('/', async (_req, res) => {
  /* const text = await new TextModel({
    _id: new mongoose.Types.ObjectId(),
    date: new Date(),
    likes: 543,
    type: 'text',
    text: 'khalid L dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  }).save();
  res.json(text); */

  res.send('<h1>Welcome!</h1>');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
