import { useEffect, useRef } from 'react';
import useAlertStore from '../stores/useAlertStore';
import useCryptoStore from '../stores/useCryptoStore';

const useAlertChecker = () => {
  const { checkAlerts, getActiveAlerts } = useAlertStore();
  const { cryptoData, addNotification } = useCryptoStore();
  const lastCheckRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const runAlertCheck = () => {
      const activeAlerts = getActiveAlerts();
      
      // Only run if we have active alerts and crypto data
      if (activeAlerts.length === 0 || Object.keys(cryptoData).length === 0) {
        console.log('⏭️ Skipping alert check: no active alerts or no crypto data');
        return;
      }

      // Prevent too frequent checks (minimum 5 seconds between checks)
      const now = Date.now();
      if (lastCheckRef.current && (now - lastCheckRef.current) < 5000) {
        console.log('⏭️ Skipping alert check: too soon since last check');
        return;
      }

      lastCheckRef.current = now;

      console.log('🔍 Running alert check with data:', {
        activeAlerts: activeAlerts.length,
        btcPrice: cryptoData.bitcoin?.price || cryptoData.bitcoin?.close,
        ethPrice: cryptoData.ethereum?.price || cryptoData.ethereum?.close,
        timestamp: new Date().toLocaleTimeString()
      });

      try {
        const triggeredAlerts = checkAlerts(cryptoData);
        
        if (triggeredAlerts && triggeredAlerts.length > 0) {
          console.log('🚨 Alerts triggered:', triggeredAlerts.length);
          
          // Show notifications for each triggered alert
          triggeredAlerts.forEach(({ alert, currentPrice }) => {
            console.log(`🚨 Alert triggered: ${alert.title} - ${alert.symbol.toUpperCase()} is now $${currentPrice.toLocaleString()}`);
            
            addNotification({
              type: 'warning',
              title: '🚨 Alert Triggered!',
              message: `${alert.title} - ${alert.symbol.toUpperCase()} is now $${Number(currentPrice).toLocaleString()}`,
            });
          });
        } else {
          console.log('✅ Alert check complete: no alerts triggered');
        }
      } catch (error) {
        console.error('❌ Alert check error:', error);
      }
    };

    // Set up periodic checking every 30 seconds (increased from 15 to reduce frequency)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      console.log('⏰ Periodic alert check...');
      runAlertCheck();
    }, 30000); // Check every 30 seconds

    // Run immediate check when crypto data changes (with throttling)
    if (Object.keys(cryptoData).length > 0) {
      console.log('🔄 Crypto data updated, scheduling alert check...');
      // Use setTimeout to defer the check and prevent immediate loops
      setTimeout(runAlertCheck, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cryptoData, getActiveAlerts]); // Removed checkAlerts and addNotification from deps to prevent loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};

export default useAlertChecker;
