import Client from '../database';

export type ArticleType = {
  id?: string;
  title: string;
  content: string;
};

export class Article {
  async index(): Promise<ArticleType[]> {
    try {
      const conn = await Client.connect();
      const query = 'SELECT * FROM articles';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get the articles. Erorr: ${error}`);
    }
  }
  async show(id: string): Promise<ArticleType> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM articles WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find article ${id}. Error: ${err}`);
    }
  }
  async create({ title, content }: ArticleType): Promise<ArticleType> {
    try {
      const conn = await Client.connect();
      const query = 'INSERT INTO articles (title, content) VALUES($1, $2) RETURNING *';
      const result = await conn.query(query, [title, content]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add new article. Error: ${error}`);
    }
  }
  async delete(id: string): Promise<ArticleType> {
    try {
      const conn = await Client.connect();
      const query = 'DELETE FROM articles WHERE id=($1)';
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete article ${id}. Error: ${error}`);
    }
  }
}
