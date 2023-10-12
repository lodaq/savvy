import express from "express";
const app = express();
const port = 3000;

app.use(express.json());
import { Post } from "./models/posts";
const posts = new Post();

app.get("/", async (_req, res) => {
  const re = await posts.index();
  console.log(re);
  res.json(re);
});

app.delete("/", async (req, res) => {
  const id = req.query.id as string;
  const re = await posts.delete(id);
  console.log(re);
  res.json(re);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
