import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { TResponse } from '@/types/response.type';

export const playerApi = createApi({
    reducerPath: 'playerApi',
    baseQuery: baseQuery,
    tagTypes: ['Player'],
    endpoints: builder => ({
        getListPlayer: builder.query<TResponse, void>({
            query: data => ({
                url: '/api/all-players',
                method: 'GET',
                data: data,
            }),
            providesTags: ['Player'],
        }),
        addPlayer: builder.mutation<TResponse, { name: string, number: string, phone: string | null, isCaptain: boolean }>({
            query: data => ({
                url: '/api/create-player',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        addMultiplePlayer: builder.mutation<TResponse, { data: Array<any> }>({
            query: data => ({
                url: '/api/create-multiple-player',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        deletePlayer: builder.mutation<TResponse, { playerId: number }>({
            query: data => ({
                url: '/api/delete-player',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        changeCaptain: builder.mutation<TResponse, { playerId: number }>({
            query: data => ({
                url: '/api/change-captain-player',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        editPlayer: builder.mutation<TResponse, { id: any, name: any, number: any, phone: any, isCaptain: any }>({
            query: data => ({
                url: '/api/edit-player',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        addSupport: builder.mutation<TResponse, { name: any, number: any }>({
            query: data => ({
                url: '/api/create-support',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        deleteSupport: builder.mutation<TResponse, { supportId: number }>({
            query: data => ({
                url: '/api/delete-support',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        removePosition: builder.mutation<TResponse, { position: string }>({
            query: data => ({
                url: '/api/remove-position',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        updatePosition: builder.mutation<TResponse, { position: any, type: any, id: any }>({
            query: data => ({
                url: '/api/update-position',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        removeAllPosition: builder.mutation<TResponse, void>({
            query: data => ({
                url: '/api/remove-all-position',
                method: 'GET',
                data: data,
            }),
            invalidatesTags: ['Player'],
        }),
        // unblock: builder.mutation<TResponse, {user_id: string}>({
        //   query: data => ({
        //     url: '/unblock',
        //     method: 'POST',
        //     data: data,
        //   }),
        //   invalidatesTags: ['Player'],
        // }),
    }),
});

export const { useGetListPlayerQuery, useAddPlayerMutation, useAddMultiplePlayerMutation, useDeletePlayerMutation, useChangeCaptainMutation, useEditPlayerMutation, useAddSupportMutation, useDeleteSupportMutation, useRemoveAllPositionMutation, useRemovePositionMutation, useUpdatePositionMutation } =
    playerApi;