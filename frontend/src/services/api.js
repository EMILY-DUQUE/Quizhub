import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // URL del backend
});

// Añadir token si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
