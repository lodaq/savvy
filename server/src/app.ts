import express from "express";
const app = express();
const port = 3000;

app.use(express.json());
import { Posts } from "./models/posts";
const posts = new Posts();

app.get("/", async (_req, res) => {
  const re = await posts.index();
  console.log(re);
  res.json(re);
});

app.delete("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
