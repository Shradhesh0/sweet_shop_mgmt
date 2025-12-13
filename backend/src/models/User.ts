import { query } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: Date;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export class UserModel {
  static async create(userData: UserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const text = `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role, created_at
    `;
    const values = [
      userData.email,
      hashedPassword,
      userData.name,
      userData.role || 'user'
    ];
    
    const result = await query(text, values);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const text = 'SELECT * FROM users WHERE email = $1';
    const result = await query(text, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const text = 'SELECT id, email, name, role, created_at FROM users WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0] || null;
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}