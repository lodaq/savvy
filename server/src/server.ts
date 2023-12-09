import bodyParser from 'body-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import articleRoutes from './handlers/articles';
import postsRoutes from './handlers/posts';
import shareRoutes from './handlers/shares';
import usersRoutes from './handlers/users';

configDotenv();

const app: express.Application = express();
const port: number = +process.env.PORT || 3000;
const corsOptions: cors.CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

articleRoutes(app);
postsRoutes(app);
shareRoutes(app);
usersRoutes(app);

app.get('/', async (_req, res) => {
  res.send('<h1>Welcome!</h1>');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
