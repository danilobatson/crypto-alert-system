import { QueryClient } from '@tanstack/react-query'

// Create optimized React Query client for crypto data
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache crypto data for 1 minute (real-time but not too frequent)
      staleTime: 60 * 1000,
      // Keep data in cache for 5 minutes
      cacheTime: 5 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for real-time feel
      refetchOnWindowFocus: true,
      // Background refetch every 2 minutes
      refetchInterval: 2 * 60 * 1000,
      // Only background refetch if window is focused
      refetchIntervalInBackground: false
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Show error notifications by default
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  }
})

// Query keys for consistent cache management
export const queryKeys = {
  crypto: {
    all: ['crypto'],
    bitcoin: ['crypto', 'bitcoin'],
    ethereum: ['crypto', 'ethereum'],
    health: ['crypto', 'health'],
    alerts: ['crypto', 'alerts']
  }
}

// API base URL
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://cryptoguard-api.cryptoguard-api.workers.dev'
