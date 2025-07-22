import {
	Card,
	Group,
	Text,
	Badge,
	Button,
	Box,
	Stack,
	NumberFormatter,
	Tooltip,
	ActionIcon,
} from '@mantine/core';
import {
	IconTrendingUp,
	IconTrendingDown,
	IconMinus,
	IconBell,
	IconRefresh,
	IconWifi,
	IconCloudDownload,
	IconAlertTriangle,
	IconClock,
} from '@tabler/icons-react';
import useAlertStore from '../../stores/useAlertStore';
import useCryptoStore from '../../stores/useCryptoStore';

const CryptoCard = ({
	symbol,
	data,
	isRealTime = false,
	showRealTimeIndicator = true,
}) => {
	const { openAlertModal } = useAlertStore();

	if (!data) {
		return (
			<Card
				padding='lg'
				radius='md'
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.08)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					minHeight: 200,
				}}>
				<Stack justify='center' align='center' h={150}>
					<Text c='dimmed'>Loading {symbol}...</Text>
				</Stack>
			</Card>
		);
	}

	const price = data.price || data.close || 0;
	const change24h = data.percent_change_24h || 0;
	const volume = data.volume_24h || data.volume || 0;
	const marketCap = data.market_cap || 0;
	const galaxyScore = data.galaxy_score || 0;

	// Calculate data freshness
	const lastUpdated = new Date(data.lastUpdated || Date.now());
	const ageMinutes = (Date.now() - lastUpdated.getTime()) / 60000;
	const source = data.source || 'api';

	const isPositive = change24h > 0;
	const isNegative = change24h < 0;
	const changeColor = isPositive ? 'green' : isNegative ? 'red' : 'gray';
	const TrendIcon = isPositive
		? IconTrendingUp
		: isNegative
		? IconTrendingDown
		: IconMinus;

	const handleCreateAlert = () => {
		openAlertModal(symbol, price);
	};

	const formatCurrency = (value) => {
		if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
		if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
		if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
		return `$${value.toFixed(2)}`;
	};

	const getDataQualityWarning = () => {
		// Using polling-based updates - no real-time WebSocket warnings needed
		if (ageMinutes > 5) {
			return {
				color: 'red',
				message: 'Data may be outdated - refreshing automatically',
			};
		}

		if (ageMinutes > 2) {
			return {
				color: 'yellow',
				message: 'Using recent API data - updates every 30 seconds',
			};
		}

		return null;
	};

	const dataWarning = getDataQualityWarning();

	return (
		<Card
			padding='lg'
			radius='md'
			style={{
				backgroundColor: 'rgba(255, 255, 255, 0.08)',
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(255, 255, 255, 0.1)',
				position: 'relative',
			}}>
			{/* Header with Symbol and Data Freshness */}
			<Group justify='space-between' align='center' mb='md'>
				<Group gap='md'>
					<Box>
						<Text fw={700} size='lg' c='white' tt='uppercase'>
							{symbol}
						</Text>
						<Group gap='xs' mt={2}>
						</Group>
					</Box>
				</Group>

				<Group gap='xs'>
					{/* Create Alert */}
					<Tooltip label='Create price alert'>
						<ActionIcon
							variant='subtle'
							color='orange'
							size='sm'
							onClick={handleCreateAlert}>
							<IconBell size={14} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>

			{/* Price Display */}
			<Stack gap='xs' mb='lg'>
				<Group align='baseline' gap='md'>
					<NumberFormatter
						value={price}
						prefix='$'
						thousandSeparator
						decimalScale={2}
						style={{
							fontSize: '1.8rem',
							fontWeight: 700,
							color: 'white',
						}}
					/>
				</Group>

				{/* 24h Change */}
				<Group gap='xs'>
					<TrendIcon size={16} color={changeColor} />
					<Text fw={600} c={changeColor} style={{ fontSize: '0.9rem' }}>
						{change24h > 0 ? '+' : ''}
						{change24h.toFixed(2)}%
					</Text>
					<Text size='sm' c='dimmed'>
						24h
					</Text>
				</Group>
			</Stack>

			{/* Data Quality Warning */}
			{dataWarning && (
				<Group gap='xs' mb='md'>
					<IconAlertTriangle size={14} color={dataWarning.color} />
					<Text size='xs' c={dataWarning.color}>
						{dataWarning.message}
					</Text>
				</Group>
			)}

			{/* Additional Metrics */}
			<Stack gap='xs'>
				<Group justify='space-between'>
					<Text size='sm' c='dimmed'>
						Volume (24h)
					</Text>
					<Text size='sm' c='white' fw={500}>
						{formatCurrency(volume)}
					</Text>
				</Group>

				<Group justify='space-between'>
					<Text size='sm' c='dimmed'>
						Market Cap
					</Text>
					<Text size='sm' c='white' fw={500}>
						{formatCurrency(marketCap)}
					</Text>
				</Group>

				{galaxyScore > 0 && (
					<Group justify='space-between'>
						<Text size='sm' c='dimmed'>
							Galaxy Score
						</Text>
						<Badge
							size='sm'
							color={
								galaxyScore > 70 ? 'green' : galaxyScore > 40 ? 'orange' : 'red'
							}
							variant='light'>
							{galaxyScore.toFixed(1)}
						</Badge>
					</Group>
				)}

				{/* Last Update with detailed info */}
				<Group justify='space-between'>
					<Text size='xs' c='dimmed'>
						Last Updated
					</Text>
					<Tooltip
						label={`Source: ${source} | ${ageMinutes.toFixed(1)} minutes ago`}>
						<Text size='xs' c='dimmed' style={{ cursor: 'help' }}>
							{lastUpdated.toLocaleTimeString()}
						</Text>
					</Tooltip>
				</Group>
			</Stack>

			{/* Quick Alert Button */}
			<Button
				fullWidth
				variant='light'
				color='orange'
				mt='md'
				leftSection={<IconBell size={16} />}
				onClick={handleCreateAlert}>
				Set Alert
			</Button>
		</Card>
	);
};

export default CryptoCard;
