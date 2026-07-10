import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const DB_DIR = process.env.VERCEL
  ? path.resolve('/tmp/data')
  : path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface NextId {
  users: number;
  bins: number;
  notifications: number;
  collectionRecords: number;
  activityLogs: number;
}

export interface JsonDatabase {
  users: any[];
  bins: any[];
  notifications: any[];
  collectionRecords: any[];
  activityLogs: any[];
  nextId: NextId;
}

const DEFAULT_DATA: JsonDatabase = {
  users: [],
  bins: [],
  notifications: [],
  collectionRecords: [],
  activityLogs: [],
  nextId: {
    users: 1,
    bins: 1,
    notifications: 1,
    collectionRecords: 1,
    activityLogs: 1,
  },
};

const SEED_USERS = [
  { fullname: 'Komakech Admin', email: 'komakech@gmail.com', password: 'job256', role: 'admin', status: 'active' },
  { fullname: 'Emmanuel Admin', email: 'emmanuel@gmail.com', password: 'job256', role: 'admin', status: 'active' },
  { fullname: 'Lisa User', email: 'lisa@gmail.com', password: 'job256', role: 'waste_manager', status: 'active' },
  { fullname: 'Mercy User', email: 'mercy@gmail.com', password: 'job256', role: 'collection_personnel', status: 'active' },
  { fullname: 'Gerald User', email: 'gerald@gmail.com', password: 'job256', role: 'collection_personnel', status: 'active' },
];

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export async function initDatabase(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.readFile(DB_FILE, 'utf-8');
    } catch {
      const seeded = { ...DEFAULT_DATA, nextId: { ...DEFAULT_DATA.nextId } };
      seeded.users = SEED_USERS.map((u, i) => ({
        id: i + 1,
        ...u,
        password: hashPassword(u.password),
      }));
      seeded.nextId.users = SEED_USERS.length + 1;
      await fs.writeFile(DB_FILE, JSON.stringify(seeded, null, 2), 'utf-8');
    }
  } catch (error) {
    throw new Error(`Failed to initialize JSON database: ${error}`);
  }
}

export async function readDatabase(): Promise<JsonDatabase> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data) as JsonDatabase;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      await initDatabase();
      return { ...DEFAULT_DATA };
    }
    throw error;
  }
}

export async function writeDatabase(data: JsonDatabase): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export default { initDatabase, readDatabase, writeDatabase };
