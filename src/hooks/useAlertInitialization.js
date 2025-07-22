import { useEffect, useState } from 'react';
import useAlertStore from '../stores/useAlertStore';
import useAlertChecker from './useAlertChecker';

const useAlertInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { alerts, getActiveAlerts } = useAlertStore();

  // Initialize alert checking system
  useAlertChecker();

  useEffect(() => {
    console.log('🚨 Initializing Alert System...');
    
    try {
      // Load any existing alerts from localStorage
      const stored = localStorage.getItem('cryptoguard-alerts');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('💾 Loaded stored alerts:', parsed.state?.alerts?.length || 0);
      }

      setIsInitialized(true);
      console.log('✅ Alert System Initialized');
      
      // Expose debug tools to window for testing
      if (typeof window !== 'undefined') {
        window.alertStore = useAlertStore.getState();
        window.testAlerts = () => {
          const activeAlerts = getActiveAlerts();
          console.log('🧪 Active alerts:', activeAlerts);
          return activeAlerts;
        };
        console.log('🔧 Alert debugging tools exposed to window.alertStore and window.testAlerts()');
      }
    } catch (error) {
      console.error('❌ Alert initialization error:', error);
      setIsInitialized(false);
    }
  }, [getActiveAlerts]);

  return {
    isInitialized,
    activeAlertsCount: getActiveAlerts().length,
    totalAlertsCount: alerts.length,
  };
};

export default useAlertInitialization;
