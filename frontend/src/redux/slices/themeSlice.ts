import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      state.theme = action.payload;
      window.localStorage.setItem('theme', state.theme);
    },
    setInitialTheme: state => {
      const localTheme = window.localStorage.getItem('theme');
      if (localTheme) {
        state.theme = localTheme;
      }
    },
  },
});

export const { toggleTheme, setInitialTheme } = themeSlice.actions;

export default themeSlice.reducer;