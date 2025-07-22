import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Badge,
  Stack,
  Box,
  NumberFormatter,
  Flex,
  Card,
  Loader
} from '@mantine/core';
import { 
  IconBell, 
  IconTrendingUp, 
  IconAlertTriangle,
  IconChartLine
} from '@tabler/icons-react';
import { useMultipleCrypto } from '../../hooks/useCryptoData';
import useAlertStore from '../../stores/useAlertStore';

const HeroSection = () => {
  const { data: cryptoData, isLoading } = useMultipleCrypto(['bitcoin', 'ethereum']);
  const { openAlertModal, alerts } = useAlertStore();

  const bitcoin = cryptoData?.bitcoin;
  const ethereum = cryptoData?.ethereum;
  const activeAlertsCount = alerts?.filter(alert => alert.isActive)?.length || 0;

  const handleCreateAlert = () => {
    openAlertModal();
  };

  return (
    <Box 
      style={{
        background: 'linear-gradient(135deg, #1a1b23 0%, #2d3748 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}
    >
      <Container size="lg">
        <Stack spacing="xl" align="center">
          
          {/* Main Headline */}
          <Stack spacing="md" align="center" style={{ textAlign: 'center' }}>
            <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              🚀 Production Ready
            </Badge>
            
            <Title 
              order={1} 
              size="3.5rem"
              weight={900}
              style={{ 
                background: 'linear-gradient(45deg, #ffffff, #a0aec0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                maxWidth: '800px'
              }}
            >
              Never Miss a Crypto Opportunity Again
            </Title>
            
            <Text 
              size="xl" 
              color="dimmed" 
              style={{ maxWidth: '600px', lineHeight: 1.6 }}
            >
              Get instant browser notifications when Bitcoin, Ethereum, or any crypto hits your price targets. 
              Built with React + LunarCrush API for real-time accuracy.
            </Text>
          </Stack>

          {/* Live Data Cards */}
          <Group spacing="lg" style={{ marginTop: '20px' }}>
            <Card 
              padding="md" 
              radius="md" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: '200px'
              }}
            >
              <Flex direction="column" align="center">
                <Group spacing="xs" mb="xs">
                  <IconChartLine size={20} color="#f59e0b" />
                  <Text weight={600} color="white">Bitcoin</Text>
                  <Badge size="xs" color={bitcoin?.percent_change_24h >= 0 ? 'green' : 'red'}>
                    LIVE
                  </Badge>
                </Group>
                {isLoading || !bitcoin ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <Text size="lg" weight={700} color="white">
                      <NumberFormatter 
                        value={bitcoin.price} 
                        prefix="$" 
                        thousandSeparator 
                        decimalScale={2} 
                      />
                    </Text>
                    <Text 
                      size="sm" 
                      color={bitcoin.percent_change_24h >= 0 ? 'green' : 'red'}
                      weight={500}
                    >
                      {bitcoin.percent_change_24h >= 0 ? '+' : ''}
                      {bitcoin.percent_change_24h?.toFixed(2)}% 24h
                    </Text>
                  </>
                )}
              </Flex>
            </Card>

            <Card 
              padding="md" 
              radius="md" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: '200px'
              }}
            >
              <Flex direction="column" align="center">
                <Group spacing="xs" mb="xs">
                  <IconChartLine size={20} color="#8b5cf6" />
                  <Text weight={600} color="white">Ethereum</Text>
                  <Badge size="xs" color={ethereum?.percent_change_24h >= 0 ? 'green' : 'red'}>
                    LIVE
                  </Badge>
                </Group>
                {isLoading || !ethereum ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <Text size="lg" weight={700} color="white">
                      <NumberFormatter 
                        value={ethereum.price} 
                        prefix="$" 
                        thousandSeparator 
                        decimalScale={2} 
                      />
                    </Text>
                    <Text 
                      size="sm" 
                      color={ethereum.percent_change_24h >= 0 ? 'green' : 'red'}
                      weight={500}
                    >
                      {ethereum.percent_change_24h >= 0 ? '+' : ''}
                      {ethereum.percent_change_24h?.toFixed(2)}% 24h
                    </Text>
                  </>
                )}
              </Flex>
            </Card>

            {activeAlertsCount > 0 && (
              <Card 
                padding="md" 
                radius="md" 
                style={{ 
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  minWidth: '200px'
                }}
              >
                <Flex direction="column" align="center">
                  <Group spacing="xs" mb="xs">
                    <IconBell size={20} color="#22c55e" />
                    <Text weight={600} color="white">Active Alerts</Text>
                  </Group>
                  <Text size="lg" weight={700} color="#22c55e">
                    {activeAlertsCount}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Monitoring prices
                  </Text>
                </Flex>
              </Card>
            )}
          </Group>

          {/* Call to Action */}
          <Group spacing="md" style={{ marginTop: '30px' }}>
            <Button 
              size="lg" 
              leftSection={<IconBell size={20} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              onClick={handleCreateAlert}
            >
              Create Your First Alert
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              color="gray"
              leftSection={<IconTrendingUp size={20} />}
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Live Dashboard
            </Button>
          </Group>

          {/* Trust Indicators */}
          <Group spacing="lg" style={{ marginTop: '20px' }}>
            <Badge variant="outline" color="gray" size="md">
              ⚡ Real-time LunarCrush API
            </Badge>
            <Badge variant="outline" color="gray" size="md">
              🔔 Browser Notifications
            </Badge>
            <Badge variant="outline" color="gray" size="md">
              📱 Mobile Optimized
            </Badge>
            <Badge variant="outline" color="gray" size="md">
              🚀 Production Ready
            </Badge>
          </Group>

        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
