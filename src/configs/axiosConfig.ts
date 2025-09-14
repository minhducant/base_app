import axios from 'axios';

import { getStorage } from '@utils/index';
import { MAIN_DOMAIN, API_PREFIX } from '@configs/apiUrl';

type responseType = { mess: string; status: boolean; data: any };

export const app = axios.create({
  baseURL: MAIN_DOMAIN + API_PREFIX,
  timeout: 3000000,
});

app.interceptors.request.use(
  async function (config) {
    const accessToken = await getStorage('accessToken');
    config.headers.Authorization = '';
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    console.log(error);
  },
);

app.interceptors.response.use(
  async function (response) {
    return { ...response }.data;
  },
  async function (error) {
    return {
      status: error?.response?.data?.statusCode,
      mess: error?.response?.data?.info?.message,
      data: [],
    };
  },
);

export const client = {
  post: (url: string, ...rest: any) =>
    app.post<any, responseType>(url, ...rest),
  get: (url: string, ...rest: any) => app.get<any, responseType>(url, ...rest),
  put: (url: string, ...rest: any) => app.put<any, responseType>(url, ...rest),
  patch: (url: string, ...rest: any) =>
    app.patch<any, responseType>(url, ...rest),
  delete: (url: string, ...rest: any) =>
    app.delete<any, responseType>(url, ...rest),
};
