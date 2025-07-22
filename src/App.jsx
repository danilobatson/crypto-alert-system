import React from 'react';
import { AppShell, Container, Group, Text, ActionIcon, Tooltip, Badge } from '@mantine/core';
import { IconBrandGithub, IconSettings, IconBell } from '@tabler/icons-react';
import { Notifications } from '@mantine/notifications';

// Components
import HeroSection from './components/layout/HeroSection';
import DashboardGrid from './components/dashboard/DashboardGrid';
import AlertModal from './components/alerts/AlertModal';
import NotificationBanner from './components/ui/NotificationBanner';

// Hooks and stores
import useAlertStore from './stores/useAlertStore';
import useCryptoStore from './stores/useCryptoStore';
import { useAlertInitialization } from './hooks/useAlertInitialization';

// Styles
import './App.css';

function App() {
  const { alerts, isInitialized } = useAlertStore();
  const { addNotification } = useCryptoStore();

  // Initialize alerts system
  useAlertInitialization();

  const activeAlertsCount = alerts.filter(alert => alert.isActive).length;

  const handleViewGitHub = () => {
    window.open('https://github.com/danilobatson/crypto-alert-system', '_blank');
  };

  return (
    <>
      <AppShell
        header={{ height: 70 }}
        padding={0}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          minHeight: '100vh'
        }}
      >
        <AppShell.Header
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Container size="xl" h="100%">
            <Group justify="space-between" h="100%">
              <Group>
                <Text
                  size="xl"
                  weight={900}
                  style={{
                    background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  🚀 CryptoGuard
                </Text>
                <Badge variant="outline" color="blue" size="sm">
                  Live Demo
                </Badge>
              </Group>

              <Group spacing="md">
                {/* Active Alerts Badge */}
                {isInitialized && activeAlertsCount > 0 && (
                  <Tooltip label={`${activeAlertsCount} active alerts monitoring prices`}>
                    <Badge
                      variant="light"
                      color={activeAlertsCount > 0 ? 'orange' : 'blue'}
                      leftSection={<IconBell size={12} />}
                      size="lg"
                    >
                      {activeAlertsCount} alerts
                    </Badge>
                  </Tooltip>
                )}

                {/* GitHub Link */}
                <Tooltip label="View source code">
                  <ActionIcon
                    variant="light"
                    color="gray"
                    size="lg"
                    onClick={handleViewGitHub}
                  >
                    <IconBrandGithub size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          {/* Hero Section */}
          <HeroSection />
          
          {/* Notification Banner */}
          <NotificationBanner />
          
          {/* Main Dashboard */}
          <div id="dashboard" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <Container size="xl">
              <DashboardGrid />
            </Container>
          </div>
        </AppShell.Main>
      </AppShell>

      {/* Alert Modal - Rendered globally */}
      <AlertModal />
    </>
  );
}

export default App;
