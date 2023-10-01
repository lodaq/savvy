import Client from "../database";

export type Post = {
  id: number;
  text: string;
  likes: number;
};

export class Posts {
  async index(): Promise<Post[]> {
    try {
      const conn = await Client.connect();
      const query = "SELECT * FROM posts;";
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get posts ${error}`);
    }
  }
  async delete(id: string): Promise<Post[]> {
    try {
      const conn = await Client.connect();
      const query = "DELETE FROM posts WHERE id=($1)";
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `couldn't delete the post with id: ${id} due to the error: ${error}`,
      );
    }
  }
  async create(text: string): Promise<Post> {
    try {
      const conn = await Client.connect();
      const query = "INSERT INTO posts (text) VALUES($1) RETURNING *";
      const result = await conn.query(query, [text]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`couldn't create the post due to the error: ${error}`);
    }
  }
}
