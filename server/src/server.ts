import bodyParser from 'body-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import shareRoutes from './handlers/shares';
import { ClerkExpressRequireAuth, WithAuthProp } from '@clerk/clerk-sdk-node';
import articleRoutes from './handlers/articles';
import postsRoutes from './handlers/posts';
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
app.use(
  ClerkExpressRequireAuth({
    jwtKey: process.env.JWT_PUBLIC_KEY,
  }),
);

articleRoutes(app);
postsRoutes(app);
shareRoutes(app);
usersRoutes(app);

app.get('/', async (_req: WithAuthProp<Request>, res) => {
  // res.json(req.auth);
  res.send('<h1>Welcome!</h1>');
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
  next();
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
