import Axios from 'axios';

export const axiosClient = Axios.create({
    baseURL: 'https://api.tauhu.cloud/api',
});

export const injectAccessToken = (accessToken: string) => {
    axiosClient.interceptors.request.use(
        (config) => {
            config.headers.Authorization = 'Bearer ' + accessToken;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};
