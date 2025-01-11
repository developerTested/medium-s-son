import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppRootState } from "@/redux/store";
import { login, logout, signUp } from "./actions/auth";
import { UserType } from "@/types";

export type AuthState = {
    loading: boolean,
    loggedIn: boolean,
    error: string | null,
    user: UserType | null,
    socialLogin: boolean,
    accessToken: string | null,
    refreshToken: string | null,
}

const initialState: AuthState = {
    loading: false,
    error: null,
    loggedIn: false,
    socialLogin: false,
    user: null,
    accessToken: null,
    refreshToken: null,
}

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        setSocialUser: (state, action) => {
            const { accessToken, refreshToken, user } = action.payload.data;
            state.loggedIn = true;
            state.socialLogin = true;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        resetUser: (state) => {
            state.loggedIn = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                const { accessToken, refreshToken, user } = action.payload.data;
                state.loading = false;
                state.loggedIn = true;
                state.user = user;
                state.socialLogin = false;
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on pending
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.loggedIn = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            })
            .addCase(logout.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred'; // Safely access the error message
            })
            .addCase(signUp.pending, (state) => {
                state.loading = true;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                const { accessToken, refreshToken, user } = action.payload;
                state.loading = false;
                state.user = user;
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
            })
    }
});

export const { resetUser, setAccessToken, setSocialUser, setRefreshToken } = authReducer.actions;
export const getAccessToken = (state: AppRootState) => state.auth.accessToken;
export const getRefreshToken = (state: AppRootState) => state.auth.refreshToken;

export default authReducer.reducer