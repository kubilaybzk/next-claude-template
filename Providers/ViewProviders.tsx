'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { store } from '@/store/store';

/**
 * Application-level providers wrapper component
 *
 * Provider hierarchy (outer to inner):
 * 1. Redux - Global state management
 * 2. React Query - Server state & data fetching
 * 3. Theme - Light/Dark mode support
 * 4. Tooltip - UI component context
 * 5. Sonner - Toast notifications
 *
 * Order matters: Less dependent providers (state) wrap more dependent providers (UI)
 */
export default function ViewProviders({ children }: { children: React.ReactNode }) {
  return (
    /**
     * Redux Provider
     * @description Provides access to Redux store throughout the application
     * @purpose Global state management for complex application state
     */
    <ReduxProvider store={store}>
      /**
       * React Query (TanStack Query) Provider
       * @description Manages server state and async data fetching
       * @purpose Handles caching, synchronization, background updates
       * @features Auto-refetching, deduplication, persistence
       */
      <QueryClientProvider client={queryClient}>
        /**
         * Theme Provider
         * @description Manages light/dark theme preference
         * @purpose Enables theme switching with persistence
         * @config attribute="class" for Tailwind dark mode
         */
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          /**
           * Tooltip Provider
           * @description Context wrapper for tooltip components
           * @purpose Enables shared tooltip state across app
           */
          <TooltipProvider>
            {children}
          </TooltipProvider>

          /**
           * Sonner Toast Provider
           * @description Toast notification system
           * @purpose Display notifications (success, error, info, etc.)
           */
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
