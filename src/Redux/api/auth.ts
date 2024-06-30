import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { TResponse } from '@/types/response.type';

export type TLoginResponse = {
  token: string;
  id: number;
  email: string
  role: string;
  status: boolean;
  teamName: string | null;
  image: string | null;
}

export type TLoginRequest = {
  email: string;
  password: string;
  // uuid: string;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  tagTypes: ['Auth'],
  endpoints: builder => ({
    login: builder.mutation<TResponse<TLoginResponse>, TLoginRequest>({
      query: data => ({
        url: '/api/login',
        method: 'post',
        data: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<TResponse<any>, void>({
      query: () => ({
        url: '/logout',
        method: 'post',
      }),
      invalidatesTags: ['Auth'],
    }),
    signup: builder.mutation<
      TResponse<any>,
      { email: string; password: string, role: string }
    >({
      query: data => ({
        url: '/api/register',
        method: 'post',
        data: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    getVerifyCode: builder.mutation<TResponse<any>, { email: string }>({
      query: email => ({
        url: '/auth/reset-password',
        method: 'post',
        data: email,
      }),
      invalidatesTags: ['Auth'],
    }),
    resetPassword: builder.mutation<TResponse<any>, { token: string; password: string }>({
      query: data => ({
        url: '/auth/update-password',
        method: 'post',
        data: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetVerifyCodeMutation,
  useResetPasswordMutation,
  useSignupMutation,
} = authApi;
