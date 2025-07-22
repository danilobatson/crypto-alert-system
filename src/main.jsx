import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

// Import Mantine styles
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

// Import app styles
import './index.css'
import App from './App.jsx'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider 
        theme={{
          colorScheme: 'dark',
          primaryColor: 'blue',
        }}
      >
        <Notifications position="top-right" />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
