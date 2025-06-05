import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const defaultUrl = "http://localhost:8080";
  const api = axios.create({
    baseURL: defaultUrl,
    headers: {
      common: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // You can add auth tokens here if needed
      // config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});