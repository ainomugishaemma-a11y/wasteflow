import { readDatabase, writeDatabase } from '../config/database';

export interface CollectionRecord {
  id?: number;
  bin_id: number;
  collected_by: number;
  collection_date?: string;
  remarks?: string;
  created_at?: string;
}

export class CollectionRecordModel {
  static async create(record: CollectionRecord): Promise<number> {
    const db = await readDatabase();
    const id = db.nextId.collectionRecords++;
    const now = new Date().toISOString();
    const newRecord = {
      id,
      bin_id: record.bin_id,
      collected_by: record.collected_by,
      collection_date: now,
      remarks: record.remarks || '',
      created_at: now,
    };
    db.collectionRecords.push(newRecord);
    await writeDatabase(db);
    return id;
  }

  static async findById(id: number): Promise<CollectionRecord | null> {
    const db = await readDatabase();
    const record = db.collectionRecords.find(r => r.id === id);
    return record || null;
  }

  static async findByBinId(binId: number, limit: number = 50): Promise<CollectionRecord[]> {
    const db = await readDatabase();
    return db.collectionRecords
      .filter(r => r.bin_id === binId)
      .sort((a, b) => (b.collection_date || '').localeCompare(a.collection_date || ''))
      .slice(0, limit);
  }

  static async getReports(startDate?: string | Date, endDate?: string | Date, hospitalId?: number): Promise<any[]> {
    const db = await readDatabase();
    let records = db.collectionRecords.map(record => {
      const bin = db.bins.find(b => b.id === record.bin_id);
      const user = db.users.find(u => u.id === record.collected_by);
      return {
        ...record,
        bin_code: bin?.bin_code || 'Unknown',
        location: bin?.location || 'Unknown',
        fullname: user?.fullname || 'Unknown',
      };
    });

    const startValue = startDate ? new Date(startDate).toISOString() : undefined;
    const endValue = endDate ? new Date(endDate).toISOString() : undefined;

    if (startValue) {
      records = records.filter(r => (r.collection_date || '') >= startValue);
    }
    if (endValue) {
      records = records.filter(r => (r.collection_date || '') <= endValue);
    }
    if (hospitalId) {
      records = records.filter(r => {
        const bin = db.bins.find(b => b.id === r.bin_id);
        return bin?.hospital_id === hospitalId;
      });
    }

    return records.sort((a, b) => (b.collection_date || '').localeCompare(a.collection_date || ''));
  }
}
