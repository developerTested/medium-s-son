import { createSlice } from "@reduxjs/toolkit";

export type AppState = {
    loading: boolean,
    error: boolean,
    mobileMenu: boolean,
    miniMenu: boolean,
    showDialog: boolean,
}

const initialState: AppState = {
    loading: false,
    error: false,
    mobileMenu: false,
    miniMenu: false,
    showDialog: false,
}

const appReducer = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setMobileMenu: (state, action) => {
            state.mobileMenu = action.payload;
        },

        setMiniMenu: (state, action) => {
            state.miniMenu = !action.payload;
        },

        setShowDialog: (state, action) => {
            state.showDialog = action.payload;
        }
    },
});


export const { setMobileMenu, setMiniMenu, setShowDialog } = appReducer.actions;

export default appReducer.reducer