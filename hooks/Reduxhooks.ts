import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

/**
 * Redux Typed Hooks
 *
 * @description Pre-typed hooks for Redux usage throughout the application
 * @usage Use these instead of plain useDispatch and useSelector for type safety
 */

/**
 * Typed useAppDispatch hook
 * @returns Dispatch function with typed actions
 * @example const dispatch = useAppDispatch(); dispatch(myAction());
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useAppSelector hook
 * @param selector Function to select state slice
 * @returns Selected state value with proper typing
 * @example const count = useAppSelector(state => state.counter.value);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
