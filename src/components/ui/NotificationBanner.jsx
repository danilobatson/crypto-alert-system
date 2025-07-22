import React, { useState, useEffect } from 'react';
import {
  Alert,
  Group,
  Text,
  Button,
  ActionIcon,
  Stack,
  Collapse,
  Box,
  Code
} from '@mantine/core';
import {
  IconBellOff,
  IconX,
  IconInfoCircle,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink
} from '@tabler/icons-react';

const NotificationBanner = ({ onDismiss }) => {
  const [permission, setPermission] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('notification-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const checkPermission = () => {
      if ('Notification' in window) {
        const currentPermission = Notification.permission;
        setPermission(currentPermission);
        
        // Show banner if notifications are not enabled
        setIsVisible(currentPermission !== 'granted');
      }
    };

    checkPermission();
    
    // Check permission every 10 seconds (reduced frequency)
    const interval = setInterval(checkPermission, 10000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent loops

  const handleRequestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setIsVisible(false);
        new Notification('🎉 Notifications Enabled!', {
          body: 'You\'ll now receive alerts when crypto prices hit your targets.',
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('notification-banner-dismissed', 'true');
    if (onDismiss) onDismiss();
  };

  const handleOpenSettings = () => {
    window.open('chrome://settings/content/notifications', '_blank');
  };

  // Don't render if not visible or dismissed
  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Alert
      variant="light"
      color={permission === 'denied' ? 'red' : 'orange'}
      icon={<IconBellOff size={16} />}
      style={{
        margin: '16px 0',
        backgroundColor: permission === 'denied' 
          ? 'rgba(244, 67, 54, 0.1)' 
          : 'rgba(255, 193, 7, 0.1)'
      }}
      withCloseButton={false}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="xs">
            <Text size="sm" fw={600}>
              {permission === 'denied' 
                ? '🔔 Notifications Blocked' 
                : '🔔 Enable Notifications for Alerts'
              }
            </Text>
          </Group>
          
          <Text size="sm">
            {permission === 'denied'
              ? 'Notifications are blocked. Enable them in your browser settings to receive crypto price alerts.'
              : 'Get instant notifications when your crypto price alerts are triggered.'
            }
          </Text>

          <Group gap="xs" mt="xs">
            {permission === 'default' && (
              <Button
                size="xs"
                color="orange"
                onClick={handleRequestPermission}
              >
                Enable Notifications
              </Button>
            )}
            
            {permission === 'denied' && (
              <Button
                size="xs"
                color="red"
                leftSection={<IconExternalLink size={12} />}
                onClick={handleOpenSettings}
              >
                Open Browser Settings
              </Button>
            )}
            
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              leftSection={isExpanded ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Instructions
            </Button>
          </Group>

          <Collapse in={isExpanded}>
            <Stack gap="sm" mt="sm">
              <Text size="sm" fw={500}>
                📱 How to enable notifications:
              </Text>
              
              <Box style={{ paddingLeft: '16px' }}>
                <Stack gap="xs">
                  <Text size="sm">
                    <strong>Chrome/Edge:</strong>
                  </Text>
                  <Text size="xs" c="dimmed">
                    1. Click the 🔒 lock icon in the address bar<br/>
                    2. Click "Notifications" → "Allow"<br/>
                    3. Refresh this page
                  </Text>
                  
                  <Text size="sm" mt="xs">
                    <strong>Safari:</strong>
                  </Text>
                  <Text size="xs" c="dimmed">
                    1. Safari menu → Preferences → Websites<br/>
                    2. Click "Notifications" → Find this site<br/>
                    3. Change to "Allow"
                  </Text>
                  
                  <Text size="sm" mt="xs">
                    <strong>Firefox:</strong>
                  </Text>
                  <Text size="xs" c="dimmed">
                    1. Click the 🛡️ shield icon in address bar<br/>
                    2. Click "Permissions" → Enable notifications<br/>
                    3. Refresh this page
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Collapse>
        </Stack>

        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={handleDismiss}
          style={{ marginTop: '2px' }}
        >
          <IconX size={14} />
        </ActionIcon>
      </Group>
    </Alert>
  );
};

export default NotificationBanner;
