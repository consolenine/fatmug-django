import axios from 'axios';
import Cookies from 'js-cookie';

const apiURL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
    baseURL: apiURL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token && token != undefined) {
            config.headers['Authorization'] = 'Token ' + token;
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const axiosFilesInstance = axios.create({
    baseURL: apiURL,
    withCredentials: true,
});

axiosFilesInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token && token != undefined) {
            config.headers['Authorization'] = 'Token ' + token;
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);