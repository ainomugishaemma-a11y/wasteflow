import api from './api';
import { Bin } from '@/types';

export const binService = {
  getAllBins: async (hospitalId?: number, status?: string, limit = 10, offset = 0) => {
    const response = await api.get('/bins', {
      params: { hospital_id: hospitalId, status, limit, offset },
    });
    return response.data;
  },

  getBinById: async (id: number) => {
    const response = await api.get(`/bins/${id}`);
    return response.data;
  },

  createBin: async (data: Omit<Bin, 'id' | 'capacity_percentage' | 'status' | 'last_update'>) => {
    const response = await api.post('/bins', data);
    return response.data;
  },

  updateBin: async (id: number, data: Partial<Bin>) => {
    const response = await api.put(`/bins/${id}`, data);
    return response.data;
  },

  deleteBin: async (id: number) => {
    const response = await api.delete(`/bins/${id}`);
    return response.data;
  },

  getBinHistory: async (id: number, days = 7) => {
    const response = await api.get(`/bins/${id}/history`, { params: { days } });
    return response.data;
  },

  updateBinStatus: async (bin_code: string, capacity_percentage: number, status: string) => {
    const response = await api.post('/bins/update', {
      bin_code,
      capacity_percentage,
      status,
    });
    return response.data;
  },
};
