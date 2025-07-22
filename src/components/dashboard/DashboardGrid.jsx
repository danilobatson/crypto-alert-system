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

	// Updated: Polling-based status instead of WebSocket
	const isConnected = !hasError && Object.keys(cryptoData).length > 0;
	const isPollingActive = isRealTimeActive;
	const activeDataCount = Object.values(cryptoData).filter(
		(data) => data && data.price
	).length;
	const healthScore = isConnected ? 100 : 0;
	// Calculate data freshness for all assets
	const getOverallFreshness = () => {
		const ages = Object.values(cryptoData)
			.filter((data) => data?.lastUpdated)
			.map(
				(data) => (Date.now() - new Date(data.lastUpdated).getTime()) / 60000
			);

		if (ages.length === 0) return 'unknown';
		const avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;

		if (avgAge < 1) return 'fresh';
		if (avgAge < 3) return 'recent';
		if (avgAge < 5) return 'aging';
		return 'stale';
	};

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
				style={{ maxWidth: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
				<Stack spacing='xl'>
					{/* Section Title */}
					<Group justify='space-between' align='center'>
						<Stack spacing='xs'>
							<Title
								order={2}
								size='2rem'
								style={{
									color: 'white',
									fontWeight: 700,
								}}>
								Live Dashboard
							</Title>
						</Stack>

						{/* Controls */}
						<Group spacing='md'>
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
						</Group>
					</Group>

					{/* Status Cards */}
					<Grid>
						<Grid.Col span={{ base: 12, md: 3 }} />
						<Grid.Col span={{ base: 12, md: 3 }}>
							<Card
								padding='lg'
								radius='md'
								style={{
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(10px)',
								}}>
								<Stack spacing='xs'>
									<Group justify='space-between'>
										<Text size='sm' color='dimmed'>
											Active Alerts
										</Text>
										<IconBell size={16} color='#f59e0b' />
									</Group>
									<Text size='lg' weight={700} color='orange'>
										{getActiveAlerts().length}
									</Text>
									<Text size='xs' color='dimmed'>
										Monitoring prices
									</Text>
								</Stack>
							</Card>
						</Grid.Col>

						<Grid.Col span={{ base: 12, md: 3 }}>
							<Card
								padding='lg'
								radius='md'
								style={{
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(10px)',
								}}>
								<Stack spacing='xs'>
									<Group justify='space-between'>
										<Text size='sm' color='dimmed'>
											Auto-Refresh
										</Text>
										<IconCloudDownload
											size={16}
											color={isPollingActive ? '#22c55e' : '#6b7280'}
										/>
									</Group>
									<Text
										size='lg'
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
						<Grid.Col span={{ base: 12, md: 3 }} />
					</Grid>

					{/* Main Content Tabs */}
					<Tabs
						value={activeTab}
						onChange={setActiveTab}
						style={{
							'.mantine-Tabs-tab': {
								color: 'rgba(255, 255, 255, 0.7)',
								borderColor: 'rgba(255, 255, 255, 0.1)',
							},
						}}>
						<Tabs.List>
							<Tabs.Tab
								value='overview'
								leftSection={<IconLayoutDashboard size={16} />}>
								Overview
							</Tabs.Tab>
							<Tabs.Tab
								value='charts'
								leftSection={<IconChartLine size={16} />}>
								Charts
							</Tabs.Tab>
							<Tabs.Tab value='alerts' leftSection={<IconBell size={16} />}>
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
