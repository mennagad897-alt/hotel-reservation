import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// الـ Interceptor ده وظيفته يفتش في الـ LocalStorage 
// لو لقى Token يحطه في الـ Headers قبل ما الـ Request يتبعت
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default API;