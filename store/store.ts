import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux Store Configuration
 *
 * @description Initializes and configures the Redux store for global state management
 * @usage Import { useAppDispatch, useAppSelector } from '@/store/hooks' to use typed hooks
 */
export const store = configureStore({
  reducer: {
    // Add your slices here
    // example: counterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
