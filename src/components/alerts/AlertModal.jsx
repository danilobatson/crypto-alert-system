import { useState, useEffect } from 'react';
import {
	Modal,
	Button,
	Group,
	TextInput,
	NumberInput,
	Select,
	Stack,
	Text,
	Badge,
	Card,
	Tabs,
	Alert,
	ActionIcon,
	Tooltip,
	Box,
	Divider,
	Switch,
} from '@mantine/core';
import {
	IconBell,
	IconBellOff,
	IconTrendingUp,
	IconTrendingDown,
	IconPercentage,
	IconVolume,
	IconClock,
	IconTarget,
	IconX,
	IconInfoCircle,
	IconExclamationMark,
} from '@tabler/icons-react';
import useAlertStore, { ALERT_TYPES } from '../../stores/useAlertStore';
import useCryptoStore from '../../stores/useCryptoStore';

// Alert type configurations
const ALERT_TYPE_CONFIGS = {
	[ALERT_TYPES.PRICE_ABOVE]: {
		icon: IconTrendingUp,
		color: 'green',
		category: 'basic',
		label: 'Price Above',
		description: 'Alert when price goes above target',
		fields: ['targetValue'],
	},
	[ALERT_TYPES.PRICE_BELOW]: {
		icon: IconTrendingDown,
		color: 'red',
		category: 'basic',
		label: 'Price Below',
		description: 'Alert when price drops below target',
		fields: ['targetValue'],
	},
	[ALERT_TYPES.PERCENT_CHANGE]: {
		icon: IconPercentage,
		color: 'blue',
		category: 'basic',
		label: 'Percent Change',
		description: 'Alert on percentage price change',
		fields: ['percentChange', 'timeframe'],
	},
	[ALERT_TYPES.VOLUME_SPIKE]: {
		icon: IconVolume,
		color: 'yellow',
		category: 'basic',
		label: 'Volume Spike',
		description: 'Alert on unusual volume activity',
		fields: ['volumeMultiplier'],
	},
	[ALERT_TYPES.MA_CROSS]: {
		icon: IconTarget,
		color: 'purple',
		category: 'advanced',
		label: 'Moving Average Cross',
		description: 'Alert when price crosses moving average',
		fields: ['maPeriod', 'crossDirection'],
	},
	[ALERT_TYPES.MOMENTUM]: {
		icon: IconClock,
		color: 'orange',
		category: 'advanced',
		label: 'Price Momentum',
		description: 'Alert on momentum changes',
		fields: ['momentumPeriod', 'momentumThreshold'],
	},
};

// Notification Permission Alert Component
const NotificationPermissionAlert = ({ onRequestPermission, onDismiss }) => {
	const [permission, setPermission] = useState('default');

	useEffect(() => {
		if ('Notification' in window) {
			setPermission(Notification.permission);
		}
	}, []);

	if (permission === 'granted') {
		return null;
	}

	const requestPermission = async () => {
		if (!('Notification' in window)) return;

		try {
			const newPermission = await Notification.requestPermission();
			setPermission(newPermission);

			if (newPermission === 'granted' && onRequestPermission) {
				onRequestPermission();

				// Show test notification
				new Notification('🎉 Notifications Enabled!', {
					body: 'Your crypto alerts will now send browser notifications.',
					icon: '/favicon.ico',
					tag: 'alert-permission-granted',
				});
			}
		} catch (error) {
			console.error('Error requesting notification permission:', error);
		}
	};

	return (
		<Alert
			icon={
				permission === 'denied' ? (
					<IconBellOff size={16} />
				) : (
					<IconExclamationMark size={16} />
				)
			}
			title={
				permission === 'denied'
					? 'Notifications Blocked'
					: 'Enable Notifications?'
			}
			color={permission === 'denied' ? 'red' : 'yellow'}
			variant='light'
			withCloseButton={!!onDismiss}
			onClose={onDismiss}
			mb='md'>
			<Stack gap='xs'>
				<Text size='sm'>
					{permission === 'denied'
						? "Browser notifications are blocked. You can still create alerts, but you won't receive notifications when they trigger."
						: 'Enable browser notifications to get instant alerts when your price targets are hit.'}
				</Text>

				{permission === 'default' && (
					<Group gap='sm'>
						<Button
							size='xs'
							variant='filled'
							color='yellow'
							leftSection={<IconBell size={14} />}
							onClick={requestPermission}>
							Enable Notifications
						</Button>
					</Group>
				)}

				{permission === 'denied' && (
					<Text size='xs' c='dimmed'>
						To enable: Click the 🔒 lock icon in your address bar →
						Notifications → Allow
					</Text>
				)}
			</Stack>
		</Alert>
	);
};

const AlertModal = () => {
	const { cryptoData } = useCryptoStore();
	const {
		isAlertModalOpen,
		closeAlertModal,
		createAlert,
		editingAlert,
		setEditingAlert,
	} = useAlertStore();

	// Form state
	const [formData, setFormData] = useState({
		title: '',
		symbol: 'bitcoin',
		type: ALERT_TYPES.PRICE_ABOVE,
		targetValue: '',
		percentChange: '',
		timeframe: '24h',
		volumeMultiplier: '2',
		maPeriod: '20',
		crossDirection: 'above',
		momentumPeriod: '14',
		momentumThreshold: '5',
	});

	const [activeTab, setActiveTab] = useState('basic');
	const [showNotificationAlert, setShowNotificationAlert] = useState(true);
	const [notificationPermissionGranted, setNotificationPermissionGranted] =
		useState(false);

	// Check notification permission on mount
	useEffect(() => {
		if ('Notification' in window) {
			setNotificationPermissionGranted(Notification.permission === 'granted');
		}
	}, []);

	// Reset form when modal opens/closes
	useEffect(() => {
		if (isAlertModalOpen) {
			if (editingAlert) {
				setFormData({ ...editingAlert });
			} else {
				setFormData({
					title: '',
					symbol: 'bitcoin',
					type: ALERT_TYPES.PRICE_ABOVE,
					targetValue: '',
					percentChange: '',
					timeframe: '24h',
					volumeMultiplier: '2',
					maPeriod: '20',
					crossDirection: 'above',
					momentumPeriod: '14',
					momentumThreshold: '5',
				});
			}
			setActiveTab('basic');
			setShowNotificationAlert(true);
		}
	}, [isAlertModalOpen, editingAlert]);

	const handleSubmit = () => {
		const alertData = {
			title:
				formData.title || `${ALERT_TYPE_CONFIGS[formData.type]?.label} Alert`,
			symbol: formData.symbol,
			type: formData.type,
			...formData,
		};

		if (editingAlert) {
			// Handle edit logic here if needed
			setEditingAlert(null);
		} else {
			createAlert(alertData);
		}

		closeAlertModal();
	};

	const getCurrentPrice = () => {
		const data = cryptoData[formData.symbol];
		return data?.price || 0;
	};

	const renderAlertTypeCard = (alertType, config) => {
		const isSelected = formData.type === alertType;
		const Icon = config.icon;

		return (
			<Card
				key={alertType}
				withBorder
				p='sm'
				style={{
					cursor: 'pointer',
					backgroundColor: isSelected
						? 'rgba(59, 130, 246, 0.1)'
						: 'rgba(255, 255, 255, 0.03)',
					borderColor: isSelected
						? 'var(--mantine-color-blue-6)'
						: 'var(--mantine-color-gray-7)',
				}}
				onClick={() => setFormData({ ...formData, type: alertType })}>
				<Group gap='sm'>
					<Box
						style={{
							padding: '6px',
							borderRadius: '6px',
							backgroundColor: `rgba(${
								config.color === 'green'
									? '76, 175, 80'
									: config.color === 'red'
									? '244, 67, 54'
									: config.color === 'blue'
									? '33, 150, 243'
									: config.color === 'yellow'
									? '255, 193, 7'
									: config.color === 'purple'
									? '156, 39, 176'
									: '255, 152, 0'
							}, 0.1)`,
						}}>
						<Icon size={16} color={`var(--mantine-color-${config.color}-6)`} />
					</Box>
					<Stack gap={2} flex={1}>
						<Text size='sm' fw={500}>
							{config.label}
						</Text>
						<Text size='xs' c='dimmed'>
							{config.description}
						</Text>
					</Stack>
					{isSelected && (
						<Badge size='xs' color='blue'>
							Selected
						</Badge>
					)}
				</Group>
			</Card>
		);
	};

	const renderFormFields = () => {
		const config = ALERT_TYPE_CONFIGS[formData.type];
		const currentPrice = getCurrentPrice();
		return (
			<Stack gap='md'>
				{config.fields.includes('targetValue') && (
					<NumberInput
						label='Target Value'
						placeholder={`Current: $${currentPrice.toLocaleString()}`}
						value={formData.targetValue}
						onChange={(value) =>
							setFormData({
								...formData,
								targetValue: Number(value),
							})
						}
						leftSection='$'
						min={0}
						step={0.01}
						required
						styles={{ input: { color: 'black' } }}
					/>
				)}

				{config.fields.includes('percentChange') && (
					<NumberInput
						label='Percent Change'
						placeholder='e.g., 5 for 5%'
						value={formData.percentChange}
						onChange={(value) =>
							setFormData({ ...formData, percentChange: value })
						}
						rightSection='%'
						min={0}
						max={100}
						step={0.1}
						required
					/>
				)}

				{config.fields.includes('timeframe') && (
					<Select
						label='Timeframe'
						value={formData.timeframe}
						onChange={(value) => setFormData({ ...formData, timeframe: value })}
						data={[
							{ value: '1h', label: '1 Hour' },
							{ value: '4h', label: '4 Hours' },
							{ value: '24h', label: '24 Hours' },
							{ value: '7d', label: '7 Days' },
						]}
						required
					/>
				)}

				{config.fields.includes('volumeMultiplier') && (
					<NumberInput
						label='Volume Multiplier'
						placeholder='e.g., 2 for 2x normal volume'
						value={formData.volumeMultiplier}
						onChange={(value) =>
							setFormData({ ...formData, volumeMultiplier: value })
						}
						rightSection='x'
						min={1}
						max={10}
						step={0.1}
						required
					/>
				)}

				{config.fields.includes('maPeriod') && (
					<NumberInput
						label='Moving Average Period'
						placeholder='e.g., 20 for 20-day MA'
						value={formData.maPeriod}
						onChange={(value) => setFormData({ ...formData, maPeriod: value })}
						min={5}
						max={200}
						step={1}
						required
					/>
				)}

				{config.fields.includes('crossDirection') && (
					<Select
						label='Cross Direction'
						value={formData.crossDirection}
						onChange={(value) =>
							setFormData({ ...formData, crossDirection: value })
						}
						data={[
							{ value: 'above', label: 'Price Above MA' },
							{ value: 'below', label: 'Price Below MA' },
						]}
						required
					/>
				)}

				{config.fields.includes('momentumPeriod') && (
					<NumberInput
						label='Momentum Period'
						placeholder='e.g., 14 for 14-day momentum'
						value={formData.momentumPeriod}
						onChange={(value) =>
							setFormData({ ...formData, momentumPeriod: value })
						}
						min={5}
						max={50}
						step={1}
						required
					/>
				)}

				{config.fields.includes('momentumThreshold') && (
					<NumberInput
						label='Momentum Threshold'
						placeholder='e.g., 5 for 5% momentum change'
						value={formData.momentumThreshold}
						onChange={(value) =>
							setFormData({ ...formData, momentumThreshold: value })
						}
						rightSection='%'
						min={1}
						max={20}
						step={0.1}
						required
					/>
				)}
			</Stack>
		);
	};

	const getAlertTypesByCategory = (category) => {
		return Object.entries(ALERT_TYPE_CONFIGS)
			.filter(([_, config]) => config.category === category)
			.map(([type, config]) => ({ type, config }));
	};

	return (
		<Modal
			opened={isAlertModalOpen}
			onClose={closeAlertModal}
			title={
				<Group gap='sm'>
					<IconBell size={20} />
					<Text fw={600}>
						{editingAlert ? 'Edit Alert' : 'Create New Alert'}
					</Text>
				</Group>
			}
			size='lg'
			centered>
			<Stack gap='md'>
				{/* Notification Permission Alert */}
				{showNotificationAlert && !notificationPermissionGranted && (
					<NotificationPermissionAlert
						onRequestPermission={() => setNotificationPermissionGranted(true)}
						onDismiss={() => setShowNotificationAlert(false)}
					/>
				)}

				{/* Basic Info */}
				<Stack gap='sm'>
					<TextInput
						label='Alert Title (Optional)'
						placeholder='Custom name for your alert'
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						// Set the input text color to red
						styles={{ input: { color: 'black' } }}
					/>

					<Select
						label='Cryptocurrency'
						value={formData.symbol}
						onChange={(value) => setFormData({ ...formData, symbol: value })}
						data={[
							{ value: 'bitcoin', label: 'Bitcoin (BTC)' },
							{ value: 'ethereum', label: 'Ethereum (ETH)' },
						]}
						required
					/>
				</Stack>

				<Divider />

				{/* Alert Type Selection */}
				<div>
					<Text size='sm' fw={600} mb='sm'>
						Select Alert Type
					</Text>

					<Tabs value={activeTab} onChange={setActiveTab}>
						<Tabs.List>
							<Tabs.Tab value='basic'>Basic Alerts</Tabs.Tab>
							<Tabs.Tab value='advanced'>Advanced Alerts</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value='basic' pt='md'>
							<Stack gap='xs'>
								{getAlertTypesByCategory('basic').map(({ type, config }) =>
									renderAlertTypeCard(type, config)
								)}
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value='advanced' pt='md'>
							<Stack gap='xs'>
								{getAlertTypesByCategory('advanced').map(({ type, config }) =>
									renderAlertTypeCard(type, config)
								)}
							</Stack>
						</Tabs.Panel>
					</Tabs>
				</div>

				<Divider />

				{/* Form Fields */}
				<div>
					<Text size='sm' fw={600} mb='sm'>
						Alert Configuration
					</Text>
					{renderFormFields()}
				</div>

				{/* Submit Buttons */}
				<Group justify='flex-end' gap='sm' pt='md'>
					<Button variant='subtle' onClick={closeAlertModal}>
						Cancel
					</Button>
					<Button
						leftSection={<IconBell size={16} />}
						onClick={handleSubmit}
						disabled={!formData.symbol || !formData.type}>
						{editingAlert ? 'Update Alert' : 'Create Alert'}
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
};

export default AlertModal;
