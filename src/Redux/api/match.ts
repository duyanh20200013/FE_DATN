import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { TResponse } from '@/types/response.type';

export const matchApi = createApi({
    reducerPath: 'matchApi',
    baseQuery: baseQuery,
    tagTypes: ['Match'],
    endpoints: builder => ({
        addMatch: builder.mutation<TResponse, { result: any, goal: any, lostGoal: any, time: any, description: any }>({
            query: data => ({
                url: '/api/create-match',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
        getAllMatch: builder.query<TResponse, { type: string }>({
            query: data => ({
                url: '/api/all-match',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        deleteMatch: builder.mutation<TResponse, { matchId: any, }>({
            query: data => ({
                url: '/api/delete-match',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
        editMatch: builder.mutation<TResponse, { id: any, result: any, goal: any, lostGoal: any, description: any }>({
            query: data => ({
                url: '/api/edit-match',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
        getMatchByDate: builder.query<TResponse, { time: any }>({
            query: data => ({
                url: '/api/get-match-by-date',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        getMatchDetails: builder.query<TResponse, { id: any }>({
            query: data => ({
                url: '/api/matchdetails',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        getMatchDetailsByTitle: builder.query<TResponse, { id: any }>({
            query: data => ({
                url: '/api/matchdetails-by-title',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        createMatchDetailsByTitle: builder.mutation<TResponse, { matchId: any, type: any, data: Array<any> }>({
            query: data => ({
                url: '/api/create-matchdetails-by-title',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
        getAllMatchDetails: builder.query<TResponse, { type: any }>({
            query: data => ({
                url: '/api/all-matchdetails',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        getAllStadium: builder.query<TResponse, { districtName: string }>({
            query: data => ({
                url: '/api/all-stadium-district',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        getMatchFinds: builder.query<TResponse, { type: string }>({
            query: data => ({
                url: '/api/all-matchfinds',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Match'],
        }),
        editMatchFind: builder.mutation<TResponse, { matchFindId: number }>({
            query: data => ({
                url: '/api/edit-matchfinds',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
        deleteMatchFind: builder.mutation<TResponse, { matchFindId: number, }>({
            query: data => ({
                url: '/api/delete-matchfinds',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
        createMatchFind: builder.mutation<TResponse, { phone: any, start: any, end: any, location: any, price: any, description: any, rate: number, level: number }>({
            query: data => ({
                url: '/api/create-matchfinds',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Match'],
        }),
    }),
});

export const { useAddMatchMutation, useGetAllMatchQuery, useDeleteMatchMutation, useEditMatchMutation, useGetMatchByDateQuery, useGetMatchDetailsQuery, useGetMatchDetailsByTitleQuery, useCreateMatchDetailsByTitleMutation, useGetAllMatchDetailsQuery, useGetAllStadiumQuery, useCreateMatchFindMutation, useDeleteMatchFindMutation, useEditMatchFindMutation, useGetMatchFindsQuery } =
    matchApi;