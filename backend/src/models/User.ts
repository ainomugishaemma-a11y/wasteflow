import bcrypt from 'bcryptjs';
import { readDatabase, writeDatabase } from '../config/database';

export interface User {
  id?: number;
  fullname: string;
  email: string;
  password?: string;
  role: 'admin' | 'waste_manager' | 'hospital_admin' | 'collection_personnel';
  hospital_id?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export class UserModel {
  static async create(user: User): Promise<number> {
    const db = await readDatabase();
    const normalizedEmail = user.email.toLowerCase();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password || '', 10);
    const id = db.nextId.users++;
    const now = new Date().toISOString();
    const newUser = {
      id,
      fullname: user.fullname,
      email: normalizedEmail,
      password: hashedPassword,
      role: user.role,
      hospital_id: user.hospital_id ?? null,
      status: user.status || 'active',
      created_at: now,
      updated_at: now,
    };

    db.users.push(newUser);
    await writeDatabase(db);
    return id;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = await readDatabase();
    const normalizedEmail = email.toLowerCase();
    const user = db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
    return user || null;
  }

  static async findById(id: number): Promise<User | null> {
    const db = await readDatabase();
    const user = db.users.find((u: any) => u.id === id);
    return user || null;
  }

  static async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    const db = await readDatabase();
    return db.users.slice(offset, offset + limit);
  }

  static async update(id: number, updates: Partial<User>): Promise<boolean> {
    const db = await readDatabase();
    const userIndex = db.users.findIndex((u: any) => u.id === id);
    if (userIndex === -1) return false;
    const user = db.users[userIndex];
    const updatedUser = {
      ...user,
      ...updates,
      email: updates.email ? updates.email.toLowerCase() : user.email,
      updated_at: new Date().toISOString(),
    };
    db.users[userIndex] = updatedUser;
    await writeDatabase(db);
    return true;
  }

  static async delete(id: number): Promise<boolean> {
    const db = await readDatabase();
    const originalLength = db.users.length;
    db.users = db.users.filter((u: any) => u.id !== id);
    if (db.users.length === originalLength) return false;
    await writeDatabase(db);
    return true;
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
