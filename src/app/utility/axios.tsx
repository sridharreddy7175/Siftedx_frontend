import axios from 'axios';
import { toast } from 'react-toastify';
import appConfig from '../../config/constant';

const API = axios.create({
    baseURL: appConfig.BASE_URL
});


API.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('token');
    config.headers['Content-Type'] = 'application/json';
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

API.interceptors.response.use(
    (response) => {
        if (response.data.data) {
            return response.data.data;
        }
        else {
            return response.data ? response.data : {};
        }
    }, (error) => {
        if (error?.response?.status === 401) {
            window.location.href = '/';
            toast.error("Session expired");
        }
        return error.response && error.response.data ? error.response.data : {};
    }
);


export default API;