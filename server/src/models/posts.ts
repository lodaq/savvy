import Client from '../database';

export type PostType = {
  id: number;
  text: string;
  likes: number;
};

export class Post {
  async index(): Promise<PostType[]> {
    try {
      const conn = await Client.connect();
      const query = 'SELECT * FROM posts';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get the posts. Erorr: ${error}`);
    }
  }
  async show(id: string): Promise<PostType> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM posts WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find post ${id}. Error: ${err}`);
    }
  }
  async create(text: string): Promise<PostType> {
    try {
      const conn = await Client.connect();
      const query = 'INSERT INTO posts (text, likes) VALUES($1, 0) RETURNING *';
      const result = await conn.query(query, [text]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add new post. Error: ${error}`);
    }
  }
  async delete(id: string): Promise<PostType> {
    try {
      const conn = await Client.connect();
      const query = 'DELETE FROM posts WHERE id=($1)';
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete post ${id}. Error: ${error}`);
    }
  }
}
