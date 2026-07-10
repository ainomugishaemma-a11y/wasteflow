import { readDatabase, writeDatabase } from '../config/database';

export interface Bin {
  id?: number;
  bin_code: string;
  location: string;
  hospital_id: number;
  capacity_percentage: number;
  status: 'available' | 'nearly_full' | 'full';
  latitude?: number | null;
  longitude?: number | null;
  last_update?: string;
  created_at?: string;
}

export class BinModel {
  static async create(bin: Bin): Promise<number> {
    const db = await readDatabase();
    const id = db.nextId.bins++;
    const now = new Date().toISOString();
    const newBin = {
      id,
      bin_code: bin.bin_code,
      location: bin.location,
      hospital_id: bin.hospital_id,
      capacity_percentage: bin.capacity_percentage || 0,
      status: bin.status || 'available',
      latitude: bin.latitude ?? null,
      longitude: bin.longitude ?? null,
      last_update: now,
      created_at: now,
    };
    db.bins.push(newBin);
    await writeDatabase(db);
    return id;
  }

  static async findByCode(bin_code: string): Promise<Bin | null> {
    const db = await readDatabase();
    return db.bins.find(b => b.bin_code === bin_code) || null;
  }

  static async findById(id: number): Promise<Bin | null> {
    const db = await readDatabase();
    return db.bins.find(b => b.id === id) || null;
  }

  static async findAll(hospitalId?: number, status?: string): Promise<Bin[]> {
    const db = await readDatabase();
    let results = db.bins;
    if (hospitalId) {
      results = results.filter(b => b.hospital_id === hospitalId);
    }
    if (status) {
      results = results.filter(b => b.status === status);
    }
    return results;
  }

  static async update(id: number, updates: Partial<Bin>): Promise<boolean> {
    const db = await readDatabase();
    const index = db.bins.findIndex(b => b.id === id);
    if (index === -1) return false;
    db.bins[index] = {
      ...db.bins[index],
      ...updates,
      last_update: new Date().toISOString(),
    };
    await writeDatabase(db);
    return true;
  }

  static async delete(id: number): Promise<boolean> {
    const db = await readDatabase();
    const initialLength = db.bins.length;
    db.bins = db.bins.filter(b => b.id !== id);
    if (db.bins.length === initialLength) {
      return false;
    }
    await writeDatabase(db);
    return true;
  }

  static async getHistory(binId: number, days: number = 7): Promise<any[]> {
    const bin = await this.findById(binId);
    if (!bin) return [];
    const history: any[] = [];
    for (let i = days; i >= 0; i--) {
      const recordedAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
      const capacity = Math.max(0, Math.min(100, bin.capacity_percentage + Math.round((Math.random() - 0.5) * 20)));
      const record = {
        date: recordedAt,
        recorded_at: recordedAt,
        capacity_percentage: capacity,
        status: capacity >= 90 ? 'full' : capacity >= 65 ? 'nearly_full' : 'available',
      };
      history.push(record);
    }
    return history;
  }

  static async recordHistory(binId: number, capacityPercentage: number, status: string): Promise<void> {
    const db = await readDatabase();
    db.activityLogs.push({
      id: db.nextId.activityLogs++,
      user_id: 0,
      action: 'bin_history_recorded',
      description: `Recorded history for bin ${binId}`,
      timestamp: new Date().toISOString(),
    });
    await writeDatabase(db);
  }

  static async getStats(hospitalId?: number): Promise<any> {
    const db = await readDatabase();
    let bins = db.bins;
    if (hospitalId) {
      bins = bins.filter(b => b.hospital_id === hospitalId);
    }
    const total = bins.length;
    const available = bins.filter(b => b.status === 'available').length;
    const nearly_full = bins.filter(b => b.status === 'nearly_full').length;
    const full = bins.filter(b => b.status === 'full').length;
    return { total, available, nearly_full, full };
  }
}
