import Axios from 'axios';
import { API_URL } from './configs';

export const apiClient = Axios.create({
    baseURL: API_URL,
});
