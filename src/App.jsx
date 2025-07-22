import React from 'react';
import { Box } from '@mantine/core';

// Components
import HeroSection from './components/layout/HeroSection';
import DashboardGrid from './components/dashboard/DashboardGrid';
import Footer from './components/layout/Footer';
import AlertModal from './components/alerts/AlertModal';
import NotificationBanner from './components/ui/NotificationBanner';

// Hooks and stores
import useAlertInitialization from './hooks/useAlertInitialization';

// Styles
import './App.css';

function App() {
  // Initialize alerts system
  const { isInitialized, activeAlertsCount } = useAlertInitialization();

  return (
    <>
      <Box
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        {/* Hero Section */}
        <HeroSection />
        
        {/* Notification Banner */}
        <NotificationBanner />
        
        {/* Main Dashboard */}
        <Box style={{ paddingTop: '40px', paddingBottom: '40px', width: '100%' }}>
          <DashboardGrid />
        </Box>

        {/* Footer */}
        <Footer />
      </Box>

      {/* Alert Modal - Rendered globally */}
      <AlertModal />
    </>
  );
}

export default App;
