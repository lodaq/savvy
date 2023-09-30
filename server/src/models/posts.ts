import Client from "../database";

export type Post = {
  id: number;
  text: string;
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
      throw new Error(`Cannot get users ${error}`);
    }
  }
}
