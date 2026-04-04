import { configureStore, createSlice } from '@reduxjs/toolkit';

// Placeholder slice to prevent empty reducer error.
// Remove when the first real feature slice is added.
const placeholderSlice = createSlice({
  name: '_placeholder',
  initialState: {},
  reducers: {},
});

export const store = configureStore({
  reducer: {
    _placeholder: placeholderSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
