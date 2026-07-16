import api from './api';

export interface UserData {
  id: number;
  fullname: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
}

export const userService = {
  async getAll(): Promise<UserData[]> {
    const res = await api.get('/users');
    return res.data.users;
  },

  async create(data: { fullname: string; email: string; password: string; role: string }) {
    const res = await api.post('/auth/register', data);
    return res.data.user;
  },

  async delete(id: number) {
    await api.delete(`/users/${id}`);
  },
};
