import bcrypt from 'bcrypt';
import Client from '../databases';

export type UserType = {
  user_id?: number;
  username: string;
  email: string;
  password: string;
};

export class User {
  async index(): Promise<UserType[]> {
    try {
      const conn = await Client.connect();
      const query = 'SELECT * FROM users';
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get the users. Error: ${error}`);
    }
  }
  async show(id: string): Promise<UserType> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE user_id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }
  async create(user: UserType): Promise<UserType> {
    try {
      const conn = await Client.connect();
      const hashedPassword = bcrypt.hashSync(
        user.password + process.env.BCRYPT_PEPPER,
        parseInt(process.env.SALT_ROUNDS),
      );
      console.log(user, hashedPassword);
      const query = 'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(query, [user.username, user.email, hashedPassword]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add new user. Error: ${error}`);
    }
  }
  async delete(id: string): Promise<UserType> {
    try {
      const conn = await Client.connect();
      const query = 'DELETE FROM users WHERE user_id=($1)';
      const result = await conn.query(query, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete user ${id}. Error: ${error}`);
    }
  }
  async authenticate(email: string, password: string): Promise<UserType | null> {
    try {
      const conn = await Client.connect();
      const query = 'SELECT password FROM users WHERE email=($1)';
      const result = await conn.query(query, [email]);
      console.log(`auth 2`);
      conn.release();
      if (result.rows.length) {
        const user: UserType = result.rows[0];
        console.log(`auth, user`, user);
        if (bcrypt.compareSync(password + process.env.BCRYPT_PEPPER, user.password)) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Could not authenticate email ${email}. Error: ${error}`);
    }
  }
}
