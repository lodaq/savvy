import express, { Request, Response } from "express";
import cors from "cors";
import { Post } from "./models/posts";
import articleRoutes from "./handlers/articles";
import postsRoutes from "./handlers/posts";

const app: express.Application = express();
const port: number = 3000;
const posts = new Post();
const corsOptions: cors.CorsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

articleRoutes(app);
postsRoutes(app);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
