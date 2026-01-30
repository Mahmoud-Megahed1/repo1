import { isClient } from '@lib/utils';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL + '/api';

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${isClient() ? localStorage.getItem('token') : ''}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized globally - session invalidated
    if (error?.response?.status === 401 && isClient()) {
      const token = localStorage.getItem('token');

      // Only handle if we HAD a token (user was logged in)
      if (token) {
        localStorage.removeItem('token');

        // Redirect to login with a message parameter
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login')) {
          window.location.href = `/${currentPath.split('/')[1] || 'en'}/login?session_expired=true`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

