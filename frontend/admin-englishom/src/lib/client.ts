import { isClient } from '@/lib/utils';
import axios from 'axios';
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
});
client.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${isClient() ? localStorage.getItem('access_token') : ''}`;

  return config;
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default client;
