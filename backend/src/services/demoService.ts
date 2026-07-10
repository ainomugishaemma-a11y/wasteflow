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

export interface DemoBin {
  id: number;
  bin_code: string;
  location: string;
  hospital_id: number;
  capacity_percentage: number;
  status: 'available' | 'nearly_full' | 'full';
  latitude?: number;
  longitude?: number;
  last_update?: Date;
}

export const demoBins: DemoBin[] = [
  { id: 1, bin_code: 'BIN-1001', location: 'North Wing - Entrance', hospital_id: 1, capacity_percentage: 25, status: 'available', latitude: 0.3476, longitude: 32.5825, last_update: new Date() },
  { id: 2, bin_code: 'BIN-1002', location: 'Emergency Dept', hospital_id: 1, capacity_percentage: 78, status: 'nearly_full', latitude: 0.3477, longitude: 32.5826, last_update: new Date() },
  { id: 3, bin_code: 'BIN-1003', location: 'Ward B', hospital_id: 1, capacity_percentage: 95, status: 'full', latitude: 0.3478, longitude: 32.5827, last_update: new Date() },
  { id: 4, bin_code: 'BIN-2001', location: 'Main Corridor', hospital_id: 2, capacity_percentage: 45, status: 'available', latitude: 0.3480, longitude: 32.5830, last_update: new Date() },
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
  demoBins,
  demoNotifications,
  demoCollectionRecords,
  findDemoUserByEmail,
  hashDemoPassword,
};
