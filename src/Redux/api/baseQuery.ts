import { Config } from '@/Config';
import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import axios from 'axios';
import { getToken, setToken } from '../reducer/auth';
import { store } from '../store';

const baseUrl = Config.API_URL as string;

axios.interceptors.request.use(config => {
  const token = getToken(store.getState());
  config.headers = {
    // 'Content-Type': 'multipart/form-data',
    Accept: '*/*',
    Authorization: 'Bearer ' + token,
  } as AxiosRequestHeaders;
  config.withCredentials = true;
  return config;
});
const baseQuery: BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
    formData?: boolean;
  },
  unknown,
  unknown
> = async ({ url, method, data, params, headers, formData }) => {
  try {
    console.log(
      '=========================Vừa request đến url:===============================',
      baseUrl + url,
      '\nvới header:',
      headers,
      '\ndata:',
      data,
    );
    const result = await axios({
      url: baseUrl + url,
      method,
      data,
      params,
      headers: {
        ...headers,
      },
    });

    return { data: result.data };
  } catch (err: any) {
    console.error(
      'FAIL===========Vừa request đến url',
      baseUrl + url,
      '=====================FAIL\n',
      err.request._response,
    );
    if (JSON.parse(err.request._response).errCode === '9998') {
      store.dispatch(setToken(null));
    }

    return {
      error: err.request._response,
    };
  }
};
export default baseQuery;
