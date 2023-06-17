import Axios from 'axios';

export const axiosClient = Axios.create({
    baseURL: 'https://api.tauhu.cloud/api',
});

export const injectAccessToken = (accessToken: string) => {
    axiosClient.defaults.headers.common['Authorization'] =
        'Bearer ' + accessToken;
};

export const ejectAccessToken = () => {
    axiosClient.defaults.headers.common['Authorization'] = undefined;
};
