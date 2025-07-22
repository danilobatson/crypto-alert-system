import {
	Grid,
	Stack,
	Card,
	Group,
	Text,
	Badge,
	ActionIcon,
	Tooltip,
	Button,
	Box,
	Select,
	Switch,
	Tabs,
	NumberFormatter,
	Alert,
	Progress,
	Container,
	Title,
	Flex,
} from '@mantine/core';
import {
	IconSettings,
	IconRefresh,
	IconPlayerPlay,
	IconPlayerPause,
	IconLayoutDashboard,
	IconTrendingUp,
	IconBell,
	IconChartLine,
	IconCards,
	IconPlus,
	IconAlertTriangle,
	IconWifi,
	IconWifiOff,
	IconClock,
	IconCloudDownload,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import CryptoCard from './CryptoCard';
import PriceChart from './PriceChart';
import AlertsList from '../alerts/AlertsList';
import NotificationBanner from '../ui/NotificationBanner';
import NotificationStatusCard from '../ui/NotificationStatusCard';
import { useMultipleCrypto } from '../../hooks/useCryptoData';
import useCryptoStore from '../../stores/useCryptoStore';
import useAlertStore from '../../stores/useAlertStore';

const DashboardGrid = () => {
	const [activeTab, setActiveTab] = useState('overview');

	const {
		isRealTimeActive,
		startRealTime,
		stopRealTime,
		refreshInterval,
		notifications,
		addNotification,
		connectionStatus,
	} = useCryptoStore();

	const { openAlertModal, getActiveAlerts } = useAlertStore();

	const {
		data: cryptoData,
		isLoading,
		refreshAll,
		hasError,
	} = useMultipleCrypto(['bitcoin', 'ethereum']);

	const isConnected = !hasError && Object.keys(cryptoData).length > 0;
	const isPollingActive = isRealTimeActive;
	const activeDataCount = Object.values(cryptoData).filter(
		(data) => data && data.price
	).length;
	const healthScore = isConnected ? 100 : 0;

	const handleTogglePolling = () => {
		if (isPollingActive) {
			stopRealTime();
			addNotification({
				type: 'info',
				title: 'Auto-refresh Paused',
				message: 'Data updates have been paused. Use manual refresh to update.',
			});
		} else {
			startRealTime();
			addNotification({
				type: 'success',
				title: 'Auto-refresh Active',
				message: `Data will refresh every ${
					refreshInterval / 1000
				} seconds automatically`,
			});
		}
	};

	const handleRefreshAll = async () => {
		try {
			await refreshAll();
			addNotification({
				type: 'success',
				title: 'Data Refreshed',
				message: 'All cryptocurrency data and charts have been updated',
			});
		} catch (error) {
			addNotification({
				type: 'error',
				title: 'Refresh Failed',
				message: 'Unable to refresh data. Please try again.',
			});
		}
	};

	return (
		<Box
			style={{
				background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
				minHeight: '60vh',
				paddingTop: '20px',
				paddingBottom: '60px',
			}}>
			<Container
				size='xl'
				style={{
					maxWidth: '100%',
					paddingLeft: { base: '20px', md: '40px' },
					paddingRight: { base: '20px', md: '40px' },
				}}>
				<Stack spacing={{ base: 'md', md: 'xl' }}>
					{/* Section Title - Mobile Responsive */}
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify='space-between'
						align={{ base: 'center', md: 'flex-start' }}
						gap='md'>
						<Stack spacing='xs' align={{ base: 'center', md: 'flex-start' }}>
							<Title
								order={2}
								style={{
									color: 'white',
									fontWeight: 700,
									textAlign: { base: 'center', md: 'left' },
								}}>
								Live Dashboard
							</Title>
						</Stack>

						{/* Controls - Mobile Stack */}
						<Flex
							direction={{ base: 'row', md: 'row' }}
							gap='md'
							wrap='wrap'
							justify='center'
							style={{ alignItems: 'center' }}>
							<Tooltip
								label={
									isPollingActive ? 'Pause auto-refresh' : 'Start auto-refresh'
								}>
								<ActionIcon
									variant='light'
									color={isPollingActive ? 'orange' : 'blue'}
									size='lg'
									onClick={handleTogglePolling}>
									{isPollingActive ? (
										<IconPlayerPause size={18} />
									) : (
										<IconPlayerPlay size={18} />
									)}
								</ActionIcon>
							</Tooltip>

							<Tooltip label='Refresh all data'>
								<ActionIcon
									variant='light'
									color='blue'
									size='lg'
									onClick={handleRefreshAll}>
									<IconRefresh size={18} />
								</ActionIcon>
							</Tooltip>
						</Flex>
					</Flex>

					{/* Status Cards - Mobile Responsive Grid */}
					<Grid>
						<Grid.Col span={{ base: 6, sm: 3 }} />

						<Grid.Col span={{ base: 6, sm: 3 }}>
							<Card
								padding={{ base: 'sm', md: 'lg' }}
								radius='md'
								style={{
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(10px)',
								}}>
								<Stack spacing='xs'>
									<Group justify='space-between'>
										<Text size={{ base: 'xs', md: 'sm' }} color='dimmed'>
											Alerts
										</Text>
										<IconBell size={16} color='#f59e0b' />
									</Group>
									<Text
										size={{ base: 'sm', md: 'lg' }}
										weight={700}
										color='orange'>
										{getActiveAlerts().length}
									</Text>
									<Text size='xs' color='dimmed'>
										Active
									</Text>
								</Stack>
							</Card>
						</Grid.Col>

						<Grid.Col span={{ base: 6, sm: 3 }}>
							<Card
								padding={{ base: 'sm', md: 'lg' }}
								radius='md'
								style={{
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(10px)',
								}}>
								<Stack spacing='xs'>
									<Group justify='space-between'>
										<Text size={{ base: 'xs', md: 'sm' }} color='dimmed'>
											Auto-Refresh
										</Text>
										<IconCloudDownload
											size={16}
											color={isPollingActive ? '#22c55e' : '#6b7280'}
										/>
									</Group>
									<Text
										size={{ base: 'sm', md: 'lg' }}
										weight={700}
										color={isPollingActive ? 'green' : 'gray'}>
										{isPollingActive ? 'Active' : 'Paused'}
									</Text>
									<Text size='xs' color='dimmed'>
										Every {refreshInterval / 1000}s
									</Text>
								</Stack>
							</Card>
						</Grid.Col>
					</Grid>

					{/* Main Content Tabs - Mobile Friendly */}
					<Tabs
						value={activeTab}
						onChange={setActiveTab}
						variant='outline'
						orientation={{ base: 'horizontal', md: 'horizontal' }}>
						<Tabs.List justify={{ base: 'center', md: 'flex-start' }}>
							<Tabs.Tab
								value='overview'
								leftSection={<IconLayoutDashboard size={16} />}
								style={{ fontSize: { base: '14px', md: '16px' } }}>
								Overview
							</Tabs.Tab>
							<Tabs.Tab
								value='charts'
								leftSection={<IconChartLine size={16} />}
								style={{ fontSize: { base: '14px', md: '16px' } }}>
								Charts
							</Tabs.Tab>
							<Tabs.Tab
								value='alerts'
								leftSection={<IconBell size={16} />}
								style={{ fontSize: { base: '14px', md: '16px' } }}>
								Alerts
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value='overview' pt='md'>
							<Grid>
								<Grid.Col span={{ base: 12, lg: 6 }}>
									<CryptoCard symbol='bitcoin' data={cryptoData.bitcoin} />
								</Grid.Col>
								<Grid.Col span={{ base: 12, lg: 6 }}>
									<CryptoCard symbol='ethereum' data={cryptoData.ethereum} />
								</Grid.Col>
							</Grid>
						</Tabs.Panel>

						<Tabs.Panel value='charts' pt='md'>
							<Grid>
								<Grid.Col span={12}>
									<PriceChart symbol='bitcoin' />
									<PriceChart symbol='ethereum' />
								</Grid.Col>
							</Grid>
						</Tabs.Panel>

						<Tabs.Panel value='alerts' pt='md'>
							<AlertsList />
						</Tabs.Panel>
					</Tabs>
				</Stack>
			</Container>
		</Box>
	);
};

export default DashboardGrid;
