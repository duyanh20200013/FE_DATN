import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { TResponse } from '@/types/response.type';

export const teamApi = createApi({
    reducerPath: 'teamApi',
    baseQuery: baseQuery,
    tagTypes: ['Team'],
    endpoints: builder => ({
        getMyTeam: builder.query<TResponse, void>({
            query: data => ({
                url: '/api/my-team',
                method: 'GET',
                data: data,
            }),
            providesTags: ['Team'],
        }),
        getAllTeam: builder.query<TResponse, void>({
            query: data => ({
                url: '/api/all-team',
                method: 'GET',
                data: data,
            }),
            providesTags: ['Team'],
        }),
        addTeam: builder.mutation<TResponse, { name: string, phone: string, description: string | null, image: any }>({
            query: data => ({
                url: '/api/create-team',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Team'],
        }),
        searchTeam: builder.mutation<TResponse, { searchText: string }>({
            query: data => ({
                url: '/api/search-team',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Team'],
        }),
        getTeamById: builder.query<TResponse, { teamId: number }>({
            query: data => ({
                url: '/api/team-by-id',
                method: 'POST',
                data: data,
            }),
            providesTags: ['Team'],
        }),
        createRate: builder.mutation<TResponse, { teamId: number, content: string, star: number }>({
            query: data => ({
                url: '/api/create-rate',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Team'],
        }),
        editTeam: builder.mutation<TResponse, { name: string | null, phone: string | null, image: string | null, description: string | null, balance: number | null }>({
            query: data => ({
                url: '/api/edit-team',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['Team'],
        }),
        getLineUp: builder.query<TResponse, void>({
            query: data => ({
                url: '/api/lineup',
                method: 'GET',
                data: data,
            }),
            providesTags: ['Team'],
        }),
    }),
});

export const { useAddTeamMutation, useGetMyTeamQuery, useGetAllTeamQuery, useSearchTeamMutation, useGetTeamByIdQuery, useCreateRateMutation, useEditTeamMutation, useGetLineUpQuery } =
    teamApi;