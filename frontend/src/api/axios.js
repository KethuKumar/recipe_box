import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL:"https://recipe-box-84ms.onrender.com/api",
  withCredentials: true
});

export default API;
