import axios from "axios";

// URL base do backend
const API_URL = "http://localhost:5000/";

// Criando uma instância do Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Adicionando o Token JWT automaticamente nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
