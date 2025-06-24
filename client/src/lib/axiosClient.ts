import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data && config.headers['Content-Type'] === 'application/json') {
      if (typeof config.data === 'object') {
        const jsonString = JSON.stringify(config.data);
        config.headers['Content-Length'] = jsonString.length.toString();
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem('accessToken');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;