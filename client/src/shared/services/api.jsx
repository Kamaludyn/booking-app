import axios from "axios";
import { toast } from "@acrool/react-toaster";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (error.message === "Network Error") {
      message = "Please check your network connection";
    } else if (error.response) {
      message = error.response.data?.message || "An error occurred";
    } else {
      message = "Something went wrong. Please try again.";
    }

    // Show toast once per error instance
    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;
