import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginBody, registerBody } from '@/schema/authSchema';
import MediumAPI from '@/utilities/api';

export const login = createAsyncThunk(
    'auth/login',
    async (data: loginBody, { rejectWithValue }) => {
        try {
            const response = await MediumAPI.post('/user/login', data)

            return Promise.resolve(response.data);

        } catch (error: any) {            
            return rejectWithValue(error)
        }
    },
)

export const logout =createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await MediumAPI.post('/user/logout');
            return Promise.resolve(response.data);
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    },
)

export const signUp = createAsyncThunk(
    'auth/register',
    async (data: registerBody, { rejectWithValue }) => {
        try {
            const response = await MediumAPI.post('/user/register', data)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error)
        }
    },
)