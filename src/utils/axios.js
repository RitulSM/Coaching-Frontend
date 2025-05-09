import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://coaching-backend-gamma.vercel.app',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error - Server might be down');
        }
        return Promise.reject(error);
    }
);

export default instance;
