import axios from './axios';

export const authApi = {
  register: async (data) => {
    const response = await axios.post('/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await axios.post('/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post('/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get('/me');
    return response.data;
  },
};