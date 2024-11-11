import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to set Authorization header
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh", {
          withCredentials: true,
        });
        const newAccessToken = response.data.access_token;

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        sessionStorage.setItem("access_token", newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("access_token");

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
