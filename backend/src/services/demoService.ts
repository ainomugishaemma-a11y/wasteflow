import bcrypt from 'bcryptjs';

export interface DemoUser {
  id: number;
  fullname: string;
  email: string;
  password: string; // plaintext for demo matching
  role: 'admin' | 'waste_manager' | 'hospital_admin' | 'collection_personnel';
  hospital_id?: number;
  status: 'active' | 'inactive';
}

export const demoUsers: DemoUser[] = [
  { id: 1, fullname: 'Komakech', email: 'komakech@gmail.com', password: 'job256', role: 'admin', status: 'active' },
  { id: 2, fullname: 'Emmanuel', email: 'emmanuel@gmail.com', password: 'job256', role: 'admin', status: 'active' },
  { id: 3, fullname: 'Lisa', email: 'lisa@gmail.com', password: 'job256', role: 'waste_manager', status: 'active' },
  { id: 4, fullname: 'Mercy', email: 'mercy@gmail.com', password: 'job256', role: 'collection_personnel', status: 'active' },
  { id: 5, fullname: 'Gerald', email: 'gerald@gmail.com', password: 'job256', role: 'collection_personnel', status: 'active' },
];

export const demoNotifications = [
  { id: 1, user_id: 3, bin_id: 2, title: 'Bin nearly full', message: 'BIN-1002 is at 78%', notification_type: 'nearly_full', read_status: false, created_at: new Date() },
  { id: 2, user_id: 1, bin_id: 3, title: 'Bin full', message: 'BIN-1003 is full', notification_type: 'full', read_status: false, created_at: new Date() },
];

export const demoCollectionRecords = [
  { id: 1, bin_id: 2, collected_by: 4, collection_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), remarks: 'Routine pickup' },
  { id: 2, bin_id: 3, collected_by: 5, collection_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), remarks: 'Emergency pickup' },
];

export function findDemoUserByEmail(email: string) {
  return demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function hashDemoPassword(plain: string) {
  // For compatibility with bcrypt checks elsewhere, return a bcrypt hash for demo passwords if needed
  return bcrypt.hashSync(plain, 10);
}

export default {
  demoUsers,
  demoNotifications,
  demoCollectionRecords,
  findDemoUserByEmail,
  hashDemoPassword,
};
