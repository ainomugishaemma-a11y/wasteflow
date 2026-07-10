import '@/styles/globals.css';

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: 'admin' | 'waste_manager' | 'hospital_admin' | 'collection_personnel';
  hospital_id?: number;
}

export interface Bin {
  id: number;
  bin_code: string;
  location: string;
  hospital_id: number;
  capacity_percentage: number;
  status: 'available' | 'nearly_full' | 'full';
  latitude?: number;
  longitude?: number;
  last_update: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  bin_id: number;
  title: string;
  message: string;
  notification_type: 'nearly_full' | 'full' | 'not_emptied';
  read_status: boolean;
  created_at: Date;
}

export interface DashboardStats {
  totalBins: number;
  availableBins: number;
  nearlyFullBins: number;
  fullBins: number;
}

export interface CollectionRecord {
  id: number;
  bin_id: number;
  collected_by: number;
  collection_date: Date;
  remarks?: string;
}
