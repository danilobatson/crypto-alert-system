import React, { useState, useEffect } from 'react';
import {
  Card,
  Group,
  Text,
  Badge,
  Button,
  Stack,
  ActionIcon,
  Tooltip,
  Box
} from '@mantine/core';
import {
  IconBell,
  IconBellOff,
  IconAlertTriangle,
  IconCheck,
  IconSettings,
  IconRefresh
} from '@tabler/icons-react';

const NotificationStatusCard = () => {
  const [permission, setPermission] = useState('default');
  const [isChecking, setIsChecking] = useState(false);

  // Check notification permission on mount and periodically
  useEffect(() => {
    const checkPermission = () => {
      if ('Notification' in window) {
        const currentPermission = Notification.permission;
        setPermission(currentPermission);
      }
    };

    checkPermission();
    
    // Check permission every 5 seconds (reduced frequency)
    const interval = setInterval(checkPermission, 5000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent loops

  const getPermissionConfig = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: IconBell,
          color: 'green',
          status: 'Enabled',
          description: 'Browser notifications are working perfectly!',
          action: 'Test Notification'
        };
      case 'denied':
        return {
          icon: IconBellOff,
          color: 'red',
          status: 'Blocked',
          description: 'Please enable notifications in your browser settings',
          action: 'Open Settings Guide'
        };
      default:
        return {
          icon: IconAlertTriangle,
          color: 'orange',
          status: 'Not Set',
          description: 'Click to enable browser notifications for alerts',
          action: 'Enable Notifications'
        };
    }
  };

  const handlePermissionAction = async () => {
    setIsChecking(true);
    
    try {
      if (permission === 'granted') {
        // Test notification
        new Notification('🚀 CryptoGuard Test', {
          body: 'Notifications are working perfectly! You\'ll receive alerts when crypto prices hit your targets.',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'test-notification'
        });
      } else if (permission === 'default') {
        // Request permission
        const result = await Notification.requestPermission();
        setPermission(result);
        
        if (result === 'granted') {
          new Notification('🎉 Notifications Enabled!', {
            body: 'You\'ll now receive alerts when crypto prices hit your targets.',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'welcome-notification'
          });
        }
      } else {
        // Open settings guide for denied permission
        window.open('chrome://settings/content/notifications', '_blank');
      }
    } catch (error) {
      console.error('Notification error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRefreshStatus = () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
    }
  };

  const config = getPermissionConfig();
  const Icon = config.icon;

  return (
    <Card
      withBorder
      p="md"
      style={{
        backgroundColor: permission === 'granted' 
          ? 'rgba(76, 175, 80, 0.1)' 
          : permission === 'denied'
          ? 'rgba(244, 67, 54, 0.1)'
          : 'rgba(255, 193, 7, 0.1)',
        borderColor: permission === 'granted' 
          ? 'var(--mantine-color-green-6)'
          : permission === 'denied'
          ? 'var(--mantine-color-red-6)'
          : 'var(--mantine-color-orange-6)'
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="sm">
          <Box
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: `var(--mantine-color-${config.color}-1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={20} color={`var(--mantine-color-${config.color}-6)`} />
          </Box>
          
          <Stack gap={2}>
            <Group gap="xs">
              <Text size="sm" fw={600}>
                Notifications
              </Text>
              <Badge 
                size="sm" 
                color={config.color}
                variant="light"
              >
                {config.status}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              {config.description}
            </Text>
          </Stack>
        </Group>

        <Group gap="xs">
          <Tooltip label="Refresh status">
            <ActionIcon
              variant="light"
              color="gray"
              size="sm"
              onClick={handleRefreshStatus}
            >
              <IconRefresh size={14} />
            </ActionIcon>
          </Tooltip>
          
          <Button
            size="xs"
            variant="light"
            color={config.color}
            loading={isChecking}
            onClick={handlePermissionAction}
          >
            {config.action}
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default NotificationStatusCard;
