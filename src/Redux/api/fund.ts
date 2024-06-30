import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { TResponse } from '@/types/response.type';

export const fundApi = createApi({
    reducerPath: 'fundApi',
    baseQuery: baseQuery,
    tagTypes: ['Fund'],
    endpoints: builder => ({
        addFund: builder.mutation<TResponse, { time: any, amount: any, description: any, type: any }>({
            query: data => ({
                url: '/api/create-fundspend',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Fund'],
        }),
        getFundOfTeam: builder.query<TResponse, { type: string }>({
            query: data => ({
                url: '/api/all-fund',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Fund'],
        }),
        deleteFund: builder.mutation<TResponse, { id: any }>({
            query: data => ({
                url: '/api/delete-fundspend',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Fund'],
        }),
        getAllFundCollectDetail: builder.query<TResponse, { type: string }>({
            query: data => ({
                url: '/api/all-fundcollect-detail',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Fund'],
        }),
        createFundCollect: builder.mutation<TResponse, { time: any, amount: any, description: any }>({
            query: data => ({
                url: '/api/create-fundcollect',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Fund'],
        }),
        createFundCollectDetail: builder.mutation<TResponse, { fundCollectId: any, playerId: any, status: any }>({
            query: data => ({
                url: '/api/create-fundcollectdetails',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Fund'],
        }),
        createMultiFundCollectDetail: builder.mutation<TResponse, { id: any, data: Array<any> }>({
            query: data => ({
                url: '/api/create-multiple-fundcollectdetails',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Fund'],
        }),
    }),
});

export const { useAddFundMutation, useGetFundOfTeamQuery, useDeleteFundMutation, useGetAllFundCollectDetailQuery, useCreateFundCollectDetailMutation, useCreateFundCollectMutation, useCreateMultiFundCollectDetailMutation } =
    fundApi;