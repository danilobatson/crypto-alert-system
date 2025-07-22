import { useState } from 'react';
import {
	Stack,
	Card,
	Group,
	Text,
	Badge,
	ActionIcon,
	Menu,
	Button,
	Box,
	Grid,
	Tooltip,
	Alert,
	Tabs,
	NumberFormatter,
	Divider,
} from '@mantine/core';
import {
	IconBell,
	IconBellOff,
	IconEdit,
	IconTrash,
	IconDots,
	IconTrendingUp,
	IconTrendingDown,
	IconPercentage,
	IconVolume,
	IconClock,
	IconCheck,
	IconX,
	IconSettings,
	IconHistory,
	IconPlus,
} from '@tabler/icons-react';
import useAlertStore, {
	ALERT_TYPES,
	ALERT_STATUS,
} from '../../stores/useAlertStore';
import useCryptoStore from '../../stores/useCryptoStore';

// Alert type configurations for display
const ALERT_TYPE_CONFIGS = {
	[ALERT_TYPES.PRICE_ABOVE]: {
		icon: IconTrendingUp,
		color: 'green',
		unit: '$',
	},
	[ALERT_TYPES.PRICE_BELOW]: {
		icon: IconTrendingDown,
		color: 'red',
		unit: '$',
	},
	[ALERT_TYPES.PERCENT_CHANGE]: {
		icon: IconPercentage,
		color: 'blue',
		unit: '%',
	},
	[ALERT_TYPES.VOLUME_SPIKE]: {
		icon: IconVolume,
		color: 'yellow',
		unit: '$',
	},
};

// Individual Alert Card Component
const AlertCard = ({
	alert,
	onEdit,
	onDelete,
	onToggle,
	currentPrice,
	debugInfo,
}) => {
	const config = ALERT_TYPE_CONFIGS[alert.type];
	const Icon = config.icon;

	const getStatusColor = (status) => {
		switch (status) {
			case ALERT_STATUS.ACTIVE:
				return 'green';
			case ALERT_STATUS.TRIGGERED:
				return 'orange';
			case ALERT_STATUS.DISABLED:
				return 'gray';
			default:
				return 'gray';
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case ALERT_STATUS.ACTIVE:
				return IconBell;
			case ALERT_STATUS.TRIGGERED:
				return IconCheck;
			case ALERT_STATUS.DISABLED:
				return IconBellOff;
			default:
				return IconBellOff;
		}
	};

	const StatusIcon = getStatusIcon(alert.status);
	const isTriggered = alert.status === ALERT_STATUS.TRIGGERED;
	const isActive = alert.status === ALERT_STATUS.ACTIVE;

	// 🔥 FIX: Safe price formatting to prevent NaN
	const formatPrice = (price) => {
		if (price === null || price === undefined) {
			return 'No data';
		}

		// Convert to number safely
		const numPrice =
			typeof price === 'string' ? parseFloat(price) : Number(price);

		if (isNaN(numPrice)) {
			console.warn(`⚠️ [AlertCard] Price is NaN:`, price);
			return 'Invalid price';
		}

		if (numPrice <= 0) {
			console.warn(`⚠️ [AlertCard] Price is zero or negative:`, numPrice);
			return 'Invalid price';
		}

		try {
			const formatted = `$${numPrice.toLocaleString()}`;
			console.log(`✅ [AlertCard] Formatted price: ${formatted}`);
			return formatted;
		} catch (error) {
			console.error(`❌ [AlertCard] Formatting error:`, error);
			return `$${numPrice}`;
		}
	};

	return (
		<Card
			withBorder
			p='md'
			style={{
				backgroundColor: isTriggered
					? 'rgba(255, 193, 7, 0.1)'
					: 'rgba(255, 255, 255, 0.05)',
				borderColor: isTriggered
					? 'var(--mantine-color-orange-6)'
					: 'rgba(255, 255, 255, 0.1)',
			}}>
			<Group justify='space-between' align='flex-start'>
				<Group gap='sm' style={{ flex: 1 }}>
					<Box
						style={{
							padding: '8px',
							borderRadius: '8px',
							backgroundColor: `var(--mantine-color-${config.color}-1)`,
						}}>
						<Icon size={20} color={`var(--mantine-color-${config.color}-6)`} />
					</Box>

					<Stack gap={4} style={{ flex: 1 }}>
						<Group justify='space-between'>
							<Text size='sm' fw={600}>
								{alert.title}
							</Text>
							<Badge
								size='sm'
								color={getStatusColor(alert.status)}
								variant='light'
								leftSection={<StatusIcon size={12} />}>
								{alert.status.toUpperCase()}
							</Badge>
						</Group>

						<Group gap='lg' wrap='nowrap'>
							<Box>
								<Text size='xs' c='dimmed'>
									Symbol
								</Text>
								<Text size='sm' fw={500}>
									{alert.symbol.toUpperCase()}
								</Text>
							</Box>

							<Box>
								<Text size='xs' c='dimmed'>
									Target Value
								</Text>
								<Text size='sm' fw={500}>
									${alert?.targetValue?.toLocaleString()}
								</Text>
							</Box>

							<Box>
								<Text size='xs' c='dimmed'>
									Current Price
								</Text>
								<Group gap='xs'>
									<Text
										size='sm'
										fw={500}
										c={
											currentPrice !== null && !isNaN(currentPrice)
												? 'white'
												: 'red'
										}>
										{formatPrice(currentPrice)}
									</Text>
									
								</Group>
							</Box>
						</Group>

						{alert.notes && (
							<Text size='xs' c='dimmed' lineClamp={2}>
								{alert.notes}
							</Text>
						)}

						<Group gap='sm'>
							<Text size='xs' c='dimmed'>
								Created: {new Date(alert.createdAt).toLocaleDateString()}
							</Text>
							{alert.lastChecked && (
								<Text size='xs' c='dimmed'>
									• Last checked:{' '}
									{new Date(alert.lastChecked).toLocaleTimeString()}
								</Text>
							)}
						</Group>
					</Stack>
				</Group>

				<Group gap='sm'>
					<Menu width={200} shadow='md'>
						<Menu.Target>
							<ActionIcon variant='subtle' color='gray'>
								<IconDots size={16} />
							</ActionIcon>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								color='black'
								leftSection={<IconEdit size={14} />}
								onClick={() => onEdit(alert)}>
								Edit Alert
							</Menu.Item>
							<Menu.Item
								color='black'
								leftSection={
									isActive ? <IconBellOff size={14} /> : <IconBell size={14} />
								}
								onClick={() => onToggle(alert.id)}>
								{isActive ? 'Disable' : 'Enable'} Alert
							</Menu.Item>
							<Menu.Divider />
							<Menu.Item
								color='red'
								leftSection={<IconTrash size={14} />}
								onClick={() => onDelete(alert.id)}>
								Delete Alert
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>
			</Group>
		</Card>
	);
};

// History Item Component
const HistoryItem = ({ item }) => {
	const config = ALERT_TYPE_CONFIGS[item.type];
	const Icon = config?.icon || IconBell;

	return (
		<Card
			withBorder
			p='sm'
			style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
			<Group gap='sm'>
				<Box
					style={{
						padding: '6px',
						borderRadius: '6px',
						backgroundColor: 'rgba(76, 175, 80, 0.1)',
					}}>
					<Icon size={16} color='var(--mantine-color-green-6)' />
				</Box>

				<Stack gap={2} flex={1}>
					<Group justify='space-between'>
						<Text size='sm' fw={500}>
							{item.alertTitle}
						</Text>
						<Text size='xs' c='dimmed'>
							{new Date(item.triggeredAt).toLocaleDateString()}
						</Text>
					</Group>
					<Text size='xs' c='dimmed'>
						{item.symbol.toUpperCase()} reached $
						{item.triggerPrice.toLocaleString()}
					</Text>
				</Stack>
			</Group>
		</Card>
	);
};

// Main AlertsList Component
const AlertsList = () => {
	const [activeTab, setActiveTab] = useState('active');

	const {
		alerts,
		alertHistory,
		deleteAlert,
		toggleAlert,
		editAlert,
		openAlertModal,
		getActiveAlerts,
		getTriggeredAlerts,
		clearTriggeredAlerts,
		getRecentHistory,
	} = useAlertStore();

	// 🔥 CRITICAL FIX: Access crypto store data properly
	const cryptoData = useCryptoStore((state) => state.cryptoData);
	const { addNotification } = useCryptoStore();

	const activeAlerts = getActiveAlerts();
	const triggeredAlerts = getTriggeredAlerts();
	const recentHistory = getRecentHistory(10);

	// 🔥 FIXED: Get current price from REAL crypto store data
	const getCurrentPrice = (symbol) => {
		const symbolKey = symbol.toLowerCase();

		// Access crypto data from the store
		const data = cryptoData?.[symbolKey];

		// Comprehensive debug logging

		if (!data) {
			console.warn(`❌ [AlertsList] No data found for symbol: ${symbol}`);
			console.warn('❌ Available symbols:', Object.keys(cryptoData || {}));
			return null;
		}

		// Try multiple price fields to ensure we get real data
		const price =
			data.price || data.close || data.current_price || data.last_price;

		if (price !== null && price !== undefined) {
			const numPrice =
				typeof price === 'string' ? parseFloat(price) : Number(price);
			console.log(
				`✅ [AlertsList] Real price for ${symbol}: $${numPrice.toLocaleString()}`
			);
			return numPrice;
		}

		console.warn(
			`❌ [AlertsList] No price field found for ${symbol}:`,
			Object.keys(data)
		);
		return null;
	};

	const handleEdit = (alert) => {
		editAlert(alert);
	};

	const handleDelete = (alertId) => {
		deleteAlert(alertId);
		addNotification({
			type: 'info',
			title: 'Alert Deleted',
			message: 'Alert has been permanently removed',
		});
	};

	const handleToggle = (alertId) => {
		toggleAlert(alertId);
		const alert = alerts.find((a) => a.id === alertId);
		const newStatus =
			alert?.status === ALERT_STATUS.ACTIVE ? 'disabled' : 'enabled';

		addNotification({
			type: 'info',
			title: `Alert ${newStatus}`,
			message: `Alert has been ${newStatus}`,
		});
	};

	const handleClearTriggered = () => {
		clearTriggeredAlerts();
		addNotification({
			type: 'success',
			title: 'Triggered Alerts Cleared',
			message: 'All triggered alerts have been reset to active',
		});
	};

	return (
		<Stack gap='lg'>
			{/* Stats Overview */}
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card
						withBorder
						style={{
							backgroundColor: 'rgba(76, 175, 80, 0.1)',
							textAlign: 'center',
						}}>
						<Text size='xs' c='dimmed'>
							Active Alerts
						</Text>
						<Text size='xl' fw={700} c='green'>
							{activeAlerts.length}
						</Text>
					</Card>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card
						withBorder
						style={{
							backgroundColor: 'rgba(255, 193, 7, 0.1)',
							textAlign: 'center',
						}}>
						<Text size='xs' c='dimmed'>
							Triggered Today
						</Text>
						<Text size='xl' fw={700} c='yellow'>
							{triggeredAlerts.length}
						</Text>
					</Card>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card
						withBorder
						style={{
							backgroundColor: 'rgba(33, 150, 243, 0.1)',
							textAlign: 'center',
						}}>
						<Text size='xs' c='dimmed'>
							Total Alerts
						</Text>
						<Text size='xl' fw={700} c='blue'>
							{alerts.length}
						</Text>
					</Card>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
					<Card
						withBorder
						style={{
							backgroundColor: 'rgba(156, 39, 176, 0.1)',
							textAlign: 'center',
						}}>
						<Text size='xs' c='dimmed'>
							History Items
						</Text>
						<Text size='xl' fw={700} c='violet'>
							{alertHistory.length}
						</Text>
					</Card>
				</Grid.Col>
			</Grid>

			{/* Data Source Warning */}
			{(!cryptoData || Object.keys(cryptoData).length === 0) && (
				<Alert color='orange' variant='light'>
					<Text size='sm' fw={500}>
						⚠️ No Crypto Data Available
					</Text>
					<Text size='xs' mt='xs'>
						Waiting for crypto data to load from the store. Please wait a
						moment...
					</Text>
				</Alert>
			)}

			{/* Tabs */}
			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value='active' leftSection={<IconBell size={16} />}>
						Active ({activeAlerts.length})
					</Tabs.Tab>
					<Tabs.Tab value='triggered' leftSection={<IconCheck size={16} />}>
						Triggered ({triggeredAlerts.length})
					</Tabs.Tab>
					<Tabs.Tab value='history' leftSection={<IconHistory size={16} />}>
						History ({recentHistory.length})
					</Tabs.Tab>
				</Tabs.List>

				{/* Active Alerts Tab */}
				<Tabs.Panel value='active' pt='md'>
					{activeAlerts.length === 0 ? (
						<Alert icon={<IconBell size={16} />} color='blue' variant='light'>
							<Text size='sm'>
								No active alerts yet. Create your first alert to start
								monitoring cryptocurrency prices!
							</Text>
							<Button
								size='xs'
								variant='light'
								color='blue'
								mt='sm'
								onClick={() => openAlertModal()}>
								Create Alert
							</Button>
						</Alert>
					) : (
						<Stack gap='sm'>
							{activeAlerts.map((alert) => {
								const currentPrice = getCurrentPrice(alert.symbol);
								const debugInfo = `Symbol: ${
									alert.symbol
								}, Store keys: ${Object.keys(cryptoData || {}).join(
									', '
								)}, Raw price: ${currentPrice}`;
								{
									console.log('valueeee', alert);
								}
								return (
									<AlertCard
										key={alert.id}
										alert={alert}
										currentPrice={currentPrice}
										debugInfo={debugInfo}
										onEdit={handleEdit}
										onDelete={handleDelete}
										onToggle={handleToggle}
									/>
								);
							})}
						</Stack>
					)}
				</Tabs.Panel>

				{/* Triggered Alerts Tab */}
				<Tabs.Panel value='triggered' pt='md'>
					{triggeredAlerts.length === 0 ? (
						<Alert icon={<IconCheck size={16} />} color='green' variant='light'>
							<Text size='sm'>
								No triggered alerts at the moment. Active alerts will appear
								here when their conditions are met.
							</Text>
						</Alert>
					) : (
						<Stack gap='md'>
							<Group justify='space-between'>
								<Text size='sm' c='dimmed'>
									{triggeredAlerts.length} alert(s) have been triggered
								</Text>
								<Button
									size='xs'
									variant='light'
									color='orange'
									onClick={handleClearTriggered}>
									Reset All to Active
								</Button>
							</Group>

							<Stack gap='sm'>
								{triggeredAlerts.map((alert) => (
									<AlertCard
										key={alert.id}
										alert={alert}
										currentPrice={getCurrentPrice(alert.symbol)}
										onEdit={handleEdit}
										onDelete={handleDelete}
										onToggle={handleToggle}
									/>
								))}
							</Stack>
						</Stack>
					)}
				</Tabs.Panel>

				{/* History Tab */}
				<Tabs.Panel value='history' pt='md'>
					{recentHistory.length === 0 ? (
						<Alert
							icon={<IconHistory size={16} />}
							color='violet'
							variant='light'>
							<Text size='sm'>
								No alert history yet. When alerts are triggered, they will
								appear here for your reference.
							</Text>
						</Alert>
					) : (
						<Stack gap='sm'>
							<Text size='sm' c='dimmed'>
								Recent alert history (last {recentHistory.length} items)
							</Text>
							{recentHistory.map((item) => (
								<HistoryItem key={item.id} item={item} />
							))}
						</Stack>
					)}
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
};

export default AlertsList;
