import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/Redux/api/auth';
type TData1 = {
    teamName: string | null;
    image: string | null;
}
type TState = {
    id: number | null;
    email: string | null;
    status: boolean | null;
    role: string | null;
    teamName: string | null;
    image: string | null;
};

const initialState: TState = { id: null, email: '', status: false, role: 'User', teamName: null, image: null };

const infoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<TState>) {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.status = action.payload.status;
            state.role = action.payload.role;
        },
        setId(state, action: PayloadAction<number>) {
            state.id = action.payload;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setStatus(state, action: PayloadAction<boolean>) {
            state.status = action.payload;
        },
        setRole(state, action: PayloadAction<string>) {
            state.role = action.payload;
        },
        setTeamName(state, action: PayloadAction<string>) {
            state.teamName = action.payload;
        },
        setImage(state, action: PayloadAction<string>) {
            state.image = action.payload;
        },
        setTeamNameAndImage(state, action: PayloadAction<TData1>) {
            state.image = action.payload.image;
            state.teamName = action.payload.teamName;
        },
        deleteUserInfo(state) {
            state.email = null;
            state.status = false;
            state.role = null;
            state.id = null;
            state.teamName = null;
            state.image = null;
        },
    },
    extraReducers: builder => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.id = payload.data.id;
                state.email = payload.data.email;
                state.role = payload.data.role;
                state.status = payload.data.status;
                state.teamName = payload.data.teamName;
                state.image = payload.data.image;
            },
        );
    },
});

export const { setUserInfo, setId, deleteUserInfo, setStatus, setRole, setEmail, setTeamName, setImage, setTeamNameAndImage } =
    infoSlice.actions;
export default infoSlice.reducer;