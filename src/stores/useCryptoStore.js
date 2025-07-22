import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Crypto store for REAL data from backend
const useCryptoStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    cryptoData: {},
    isLoading: false,
    hasError: false,
    lastUpdate: null,
    connectionStatus: 'connected',
    isRealTimeActive: true,
    refreshInterval: 30000,
    notifications: [],
    
    // Set crypto data from backend
    setCryptoData: (symbol, data) => {
      console.log(`📊 [STORE] setCryptoData called:`, {
        symbol,
        price: data.price,
        source: data.source,
        isReal: data.isReal
      })
      
      const symbolKey = symbol.toLowerCase()
      const newData = {
        ...data,
        lastUpdated: new Date().toISOString()
      }
      
      set((state) => {
        const updatedState = {
          ...state,
          cryptoData: {
            ...state.cryptoData,
            [symbolKey]: newData
          },
          lastUpdate: new Date().toISOString(),
          hasError: false
        }
        
        console.log(`📊 [STORE] State updated:`, {
          symbol: symbolKey,
          price: newData.price,
          totalSymbols: Object.keys(updatedState.cryptoData).length,
          allSymbols: Object.keys(updatedState.cryptoData)
        })
        
        return updatedState
      })
      
      // Verify the update worked
      setTimeout(() => {
        const currentState = get()
        const storedData = currentState.cryptoData[symbolKey]
        if (storedData && storedData.price) {
          console.log(`✅ [STORE] Verified ${symbol} stored: $${storedData.price.toLocaleString()}`)
        } else {
          console.error(`❌ [STORE] Failed to store ${symbol}!`)
        }
      }, 100)
    },

    // Clear data
    clearCryptoData: (symbol) => {
      console.log(`🧹 [STORE] Clearing data for ${symbol}`)
      set((state) => {
        const newData = { ...state.cryptoData }
        delete newData[symbol.toLowerCase()]
        return { cryptoData: newData }
      })
    },

    clearAllCryptoData: () => {
      console.log('🧹 [STORE] Clearing all crypto data...')
      set({ cryptoData: {} })
    },

    // Loading and error states
    setLoading: (isLoading) => {
      console.log(`⏳ [STORE] setLoading: ${isLoading}`)
      set({ isLoading })
    },
    
    setError: (hasError, message = null) => {
      console.log(`❌ [STORE] setError: ${hasError}, message: ${message}`)
      set({ hasError })
      if (message) {
        get().addNotification({
          type: 'error',
          title: 'Data Error',
          message
        })
      }
    },

    // Real-time simulation (backend polling)
    startRealTime: () => {
      console.log('🚀 [STORE] Starting real-time backend polling...')
      set({ isRealTimeActive: true, connectionStatus: 'connected' })
      get().addNotification({
        type: 'success',
        title: 'Real-time Active',
        message: 'Fetching live data from backend every 30 seconds'
      })
    },

    stopRealTime: () => {
      console.log('⏸️ [STORE] Stopping real-time polling...')
      set({ isRealTimeActive: false, connectionStatus: 'paused' })
      get().addNotification({
        type: 'info',
        title: 'Real-time Paused',
        message: 'Backend polling paused'
      })
    },

    // Notifications
    addNotification: (notification) => {
      const id = Date.now().toString()
      set((state) => ({
        notifications: [{
          id,
          timestamp: new Date().toISOString(),
          shown: false,
          ...notification
        }, ...state.notifications.slice(0, 9)]
      }))
    },

    clearNotifications: () => set({ notifications: [] }),
    setRefreshInterval: (interval) => set({ refreshInterval: interval }),

    // Debug and validation
    getDebugInfo: () => {
      const state = get()
      return {
        dataCount: Object.keys(state.cryptoData).length,
        symbols: Object.keys(state.cryptoData),
        prices: Object.fromEntries(
          Object.entries(state.cryptoData).map(([symbol, data]) => [
            symbol.toUpperCase(), 
            {
              price: data.price,
              source: data.source,
              lastUpdated: data.lastUpdated
            }
          ])
        ),
        lastUpdate: state.lastUpdate,
        isLoading: state.isLoading,
        hasError: state.hasError,
        rawCryptoData: state.cryptoData
      }
    },

    validateStoreData: () => {
      const state = get()
      console.log('🔍 [STORE] Validation:', state.getDebugInfo())
      
      const hasValidData = Object.values(state.cryptoData).some(data => 
        data && typeof data.price === 'number' && data.price > 0
      )
      
      console.log(`${hasValidData ? '✅' : '⚠️'} [STORE] Has valid data: ${hasValidData}`)
      return hasValidData
    }
  }))
)

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.useCryptoStore = useCryptoStore
  window.debugCryptoStore = () => {
    const debug = useCryptoStore.getState().getDebugInfo()
    console.table(debug.prices)
    return debug
  }
  window.testStoreUpdate = () => {
    console.log('🧪 Testing store update...')
    const store = useCryptoStore.getState()
    store.setCryptoData('test', { price: 12345, source: 'test', isReal: true })
  }
  console.log('🔧 Debug tools: window.debugCryptoStore() | window.testStoreUpdate()')
}

export default useCryptoStore
