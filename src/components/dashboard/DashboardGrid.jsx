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
import HeroSection from './HeroSection';

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
			.filter(data => data?.lastUpdated)
			.map(data => (Date.now() - new Date(data.lastUpdated).getTime()) / 60000);

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

	const handleCreateAlert = (symbol, prefillData = {}) => {
		const symbolData = cryptoData[symbol.toLowerCase()];
		openAlertModal({
			symbol: symbol.toLowerCase(),
			...prefillData,
			currentPrice: symbolData?.price || symbolData?.close,
		});
	};

	const freshness = getOverallFreshness();
	const freshnessConfig = {
		fresh: { color: 'green', label: 'FRESH', icon: IconCloudDownload },
		recent: { color: 'blue', label: 'RECENT', icon: IconClock },
		aging: { color: 'yellow', label: 'AGING', icon: IconClock },
		stale: { color: 'red', label: 'STALE', icon: IconAlertTriangle },
		unknown: { color: 'gray', label: 'UNKNOWN', icon: IconAlertTriangle }
	};

	const currentFreshness = freshnessConfig[freshness] || freshnessConfig.unknown;

	return (
		<Stack gap='lg' mt='40px'>
			{/* Notification Permission Banner */}
			<NotificationBanner />

			{/* Data Status Card - Updated for Polling */}
			<Card
				padding='lg'
				radius='md'
				style={{
					background: 'rgba(255, 255, 255, 0.08)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
				}}>
				<Group justify='space-between' align='center'>
					<Group gap='md'>
						<Box>
							<Group gap='xs'>
								<Text fw={600} c='white'>
									Data Status
								</Text>
								<Badge
									size='sm'
									color={isConnected ? 'green' : 'red'}
									variant='light'>
									{isConnected ? 'API CONNECTED' : 'CONNECTION ISSUES'}
								</Badge>
								<Badge
									size='sm'
									color={currentFreshness.color}
									variant='light'
									leftSection={React.createElement(currentFreshness.icon, { size: 12 })}>
									{currentFreshness.label}
								</Badge>
							</Group>
							<Text size='sm' c='dimmed'>
								{isPollingActive
									? `Auto-refresh active • ${activeDataCount} crypto assets • Updates every ${refreshInterval/1000}s`
									: `Manual refresh mode • ${activeDataCount} crypto assets loaded`}
							</Text>
						</Box>
					</Group>

					<Group gap='md'>
						{/* Polling Toggle */}
						<Tooltip
							label={
								isPollingActive
									? 'Pause automatic updates'
									: 'Enable automatic updates'
							}>
							<ActionIcon
								variant='light'
								color={isPollingActive ? 'orange' : 'green'}
								size='lg'
								onClick={handleTogglePolling}
								style={{
									backgroundColor: isPollingActive
										? 'rgba(255, 193, 7, 0.1)'
										: 'rgba(76, 175, 80, 0.1)',
								}}>
								{isPollingActive ? (
									<IconPlayerPause size={18} />
								) : (
									<IconPlayerPlay size={18} />
								)}
							</ActionIcon>
						</Tooltip>

						{/* Refresh Button */}
						<Tooltip label='Refresh all data'>
							<ActionIcon
								variant='light'
								color='blue'
								size='lg'
								onClick={handleRefreshAll}
								loading={isLoading}>
								<IconRefresh size={18} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>

				{/* Connection Issues Alert */}
				{!isConnected && (
					<Alert
						icon={<IconWifiOff size={16} />}
						color='orange'
						variant='light'
						mt='md'>
						<Group justify='space-between'>
							<Text size='sm'>
								Unable to connect to API. Check your internet connection.
							</Text>
							{healthScore !== undefined && (
								<Progress value={healthScore} size='sm' w={100} />
							)}
						</Group>
					</Alert>
				)}

				{/* Active Polling Status */}
				{isPollingActive && isConnected && activeDataCount > 0 && (
					<Alert
						icon={<IconCloudDownload size={16} />}
						color='blue'
						variant='light'
						mt='md'>
						<Group justify='space-between'>
							<Text size='sm'>
								📡 POLLING: Automatically refreshing {activeDataCount} cryptocurrency prices every {refreshInterval/1000} seconds
							</Text>
							<Badge color='blue' variant='light'>
								{activeDataCount} Active
							</Badge>
						</Group>
					</Alert>
				)}
			</Card>

			{/* Tabs Navigation */}
			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab
						value='overview'
						leftSection={<IconLayoutDashboard size={16} />}>
						Overview
					</Tabs.Tab>
					<Tabs.Tab value='charts' leftSection={<IconTrendingUp size={16} />}>
						Charts
					</Tabs.Tab>
					<Tabs.Tab value='alerts' leftSection={<IconBell size={16} />}>
						Alerts ({getActiveAlerts().length})
					</Tabs.Tab>
					<Tabs.Tab value='notifications' leftSection={<IconBell size={16} />}>
						Notifications
					</Tabs.Tab>
				</Tabs.List>

				{/* Overview Tab */}
				<Tabs.Panel value='overview' pt='md'>
					<Stack gap='lg'>
						{/* Hero Section */}
						<HeroSection cryptoData={cryptoData} />

						{/* Crypto Cards Grid - Updated to remove websocket checks */}
						<Grid>
							{Object.entries(cryptoData)
								.sort(([a], [b]) => a.localeCompare(b))
								.map(([symbol, data]) => (
									<Grid.Col key={symbol} span={{ base: 12, md: 6 }}>
										<CryptoCard
											symbol={symbol}
											data={data}
											isRealTime={false} // No WebSocket, using polling
											showRealTimeIndicator={true}
										/>
									</Grid.Col>
								))}
						</Grid>

						{/* Quick Actions */}
						<Card
							padding='lg'
							radius='md'
							style={{
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
							}}>
							<Group justify='space-between' align='center'>
								<Box>
									<Text fw={600} c='white'>
										Quick Actions
									</Text>
									<Text size='sm' c='dimmed'>
										Set up alerts and manage your watchlist
									</Text>
								</Box>

								<Group gap='md'>
									<Button
										leftSection={<IconPlus size={16} />}
										variant='light'
										color='orange'
										onClick={() => openAlertModal()}>
										Create Alert
									</Button>

									<Button
										leftSection={<IconSettings size={16} />}
										variant='light'
										color='gray'>
										Settings
									</Button>
								</Group>
							</Group>
						</Card>
					</Stack>
				</Tabs.Panel>

				{/* Charts Tab */}
				<Tabs.Panel value='charts' pt='md'>
					<Grid>
						{Object.entries(cryptoData)
							.sort(([a], [b]) => a.localeCompare(b))
							.map(([symbol, data]) => (
								<Grid.Col key={symbol} span={{ base: 12, lg: 6 }}>
									<PriceChart
										symbol={symbol}
										data={data}
										isRealTime={false} // No WebSocket, using polling
									/>
								</Grid.Col>
							))}
					</Grid>
				</Tabs.Panel>

				{/* Alerts Tab */}
				<Tabs.Panel value='alerts' pt='md'>
					<AlertsList />
				</Tabs.Panel>

				{/* Notifications Tab */}
				<Tabs.Panel value='notifications' pt='md'>
					<Stack gap='md'>
						<Text size='lg' fw={600}>
							Notification Settings
						</Text>

						<NotificationStatusCard />

						<Card withBorder p='md'>
							<Stack gap='md'>
								<Text size='sm' fw={500}>
									📱 How Notifications Work
								</Text>
								<Text size='sm' c='dimmed'>
									When your crypto price alerts are triggered, you'll receive:
								</Text>
								<Box style={{ paddingLeft: '16px' }}>
									<Text size='sm'>• Desktop browser notifications</Text>
									<Text size='sm'>• In-app notification alerts</Text>
									<Text size='sm'>• Visual indicators in the alert center</Text>
								</Box>

								<Group justify='space-between' mt='md'>
									<Text size='sm'>Test your notification system:</Text>
									<Button
										size='xs'
										variant='light'
										onClick={() => {
											if (Notification.permission === 'granted') {
												new Notification('🧪 Test Notification', {
													body: 'Your notifications are working perfectly!',
													icon: '/favicon.ico'
												});
											} else {
												addNotification({
													type: 'info',
													title: 'Enable Notifications',
													message: 'Please enable browser notifications first'
												});
											}
										}}
									>
										Send Test Notification
									</Button>
								</Group>
							</Stack>
						</Card>
					</Stack>
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
};

export default DashboardGrid;
