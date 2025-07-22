import React from 'react';
import { Alert, Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CryptoGuard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <Stack spacing="lg" align="center">
            <IconAlertTriangle size={64} color="orange" />
            <Title order={2} color="white">Oops! Something went wrong</Title>
            <Text color="dimmed" size="lg">
              The crypto alert system encountered an unexpected error. 
              Don't worry, your alerts are safe!
            </Text>
            <Alert color="orange" variant="light" style={{ maxWidth: '400px' }}>
              <Text size="sm">
                This is likely a temporary issue. Try refreshing the page or check back in a few minutes.
              </Text>
            </Alert>
            <Button 
              leftSection={<IconRefresh size={16} />}
              onClick={() => window.location.reload()}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Refresh Page
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
