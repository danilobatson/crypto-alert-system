import {
	Card,
	Group,
	Text,
	Badge,
	ActionIcon,
	Tooltip,
	Box,
	Stack,
	SegmentedControl,
	NumberFormatter,
} from '@mantine/core';
import {
	IconTrendingUp,
	IconTrendingDown,
	IconMinus,
	IconChartLine,
	IconChartArea,
	IconChartBar,
	IconRefresh,
	IconMaximize,
	IconMinimize,
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import useCryptoStore from '../../stores/useCryptoStore';

const PriceChart = ({ symbol, data, isRealTime = false }) => {
	const [chartType, setChartType] = useState('line');
	const [timeframe, setTimeframe] = useState('24h');
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [priceHistory, setPriceHistory] = useState([]);
	const [isChartReady, setIsChartReady] = useState(false);
	const lastPriceRef = useRef(null);

	// Get real-time data from store
	const { cryptoData } = useCryptoStore();
	const currentSymbol = symbol.toLowerCase();
	const liveData = cryptoData[currentSymbol] || data;

	// Process data for chart metrics
	const priceMetrics = liveData
		? {
				current: liveData.price || liveData.close || 0,
				changePercent: liveData.percent_change_24h || 0,
				high24h: liveData.price ? liveData.price * 1.05 : 0,
				low24h: liveData.price ? liveData.price * 0.95 : 0,
				volume24h: liveData.volume_24h || liveData.volume || 0,
		  }
		: null;

	// Calculate realistic Y-axis domain based on current price
	const getYAxisDomain = () => {
		if (!priceMetrics) return ['auto', 'auto'];

		const currentPrice = priceMetrics.current;
		const changePercent = Math.abs(priceMetrics.changePercent) || 2; // Default to 2% if no change data

		// Use a minimum of 2% range, or expand based on actual 24h change
		const rangePercent = Math.max(changePercent * 1.5, 2); // At least 2%, or 1.5x the actual change

		const minPrice = currentPrice * (1 - rangePercent / 100);
		const maxPrice = currentPrice * (1 + rangePercent / 100);

		return [
			Math.floor(minPrice), // Round down for min
			Math.ceil(maxPrice), // Round up for max
		];
	};

	// Delay chart rendering to avoid dimension errors
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsChartReady(true);
		}, 500); // 500ms delay to ensure DOM is ready

		return () => clearTimeout(timer);
	}, []);

	// Update price history when new data arrives
	useEffect(() => {
		if (!priceMetrics || !priceMetrics.current) return;

		const currentPrice = priceMetrics.current;
		const now = Date.now();

		// Only add if price changed significantly (avoid spam)
		if (
			lastPriceRef.current &&
			Math.abs(currentPrice - lastPriceRef.current) < currentPrice * 0.001
		) {
			return;
		}

		const newDataPoint = {
			time: now,
			price: currentPrice,
			formattedTime: new Date(now).toLocaleTimeString(),
			volume: priceMetrics.volume24h || 0,
		};

		setPriceHistory((prev) => {
			const updated = [...prev, newDataPoint];
			// Keep last 50 points for smooth chart
			return updated.slice(-50);
		});

		lastPriceRef.current = currentPrice;
	}, [priceMetrics?.current]);

	// Initialize with some historical data points
	useEffect(() => {
		if (!priceMetrics || priceHistory.length > 0) return;

		const basePrice = priceMetrics.current;
		const initialHistory = [];
		const now = Date.now();

		// Generate 20 initial points with more realistic variation
		for (let i = 19; i >= 0; i--) {
			const timestamp = now - i * 60 * 1000; // 1 minute intervals
			const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation (more realistic)
			const price = basePrice * (1 + variation);

			initialHistory.push({
				time: timestamp,
				price: price,
				formattedTime: new Date(timestamp).toLocaleTimeString(),
				volume: priceMetrics.volume24h * (0.8 + Math.random() * 0.4),
			});
		}

		setPriceHistory(initialHistory);
		lastPriceRef.current = basePrice;
	}, [priceMetrics?.current]);

	const handleChartTypeChange = (value) => {
		setChartType(value);
	};

	const handleTimeframeChange = (value) => {
		setTimeframe(value);
	};

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	const handleRefresh = () => {
		// Clear history to restart with fresh data
		setPriceHistory([]);
		lastPriceRef.current = null;
	};

	// Custom tooltip for chart
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			const currentPrice = priceMetrics?.current || 0;
			const priceChange = data.price - currentPrice;
			const percentChange =
				currentPrice > 0 ? (priceChange / currentPrice) * 100 : 0;

			return (
				<Card
					withBorder
					padding='xs'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
					<Text size='xs' c='dimmed'>
						{data.formattedTime}
					</Text>
					<Text fw={600} c='white'>
						<NumberFormatter
							value={data.price}
							prefix='$'
							thousandSeparator
							decimalScale={2}
						/>
					</Text>
					<Text size='xs' c={percentChange >= 0 ? 'green' : 'red'}>
						{percentChange >= 0 ? '+' : ''}
						{percentChange.toFixed(3)}%
					</Text>
				</Card>
			);
		}
		return null;
	};

	const renderChart = () => {
		const chartHeight = isFullscreen ? 400 : 260;
		const chartWidth = isFullscreen ? 800 : 600;
		const yAxisDomain = getYAxisDomain();

		// Show loading state if chart not ready or no data
		if (!isChartReady || !priceHistory || priceHistory.length < 2) {
			return (
				<div
					style={{
						height: chartHeight,
						width: '100%',
						minHeight: chartHeight,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'rgba(255, 255, 255, 0.05)',
						borderRadius: '8px',
						border: '1px solid rgba(255, 255, 255, 0.1)',
					}}>
					<Stack align='center' gap='xs'>
						<IconChartLine size={32} color='var(--mantine-color-dimmed)' />
						<Text c='dimmed' size='sm'>
							{!isChartReady ? 'Loading chart...' : 'Building chart data...'}
						</Text>
						{isRealTime && isChartReady && (
							<Text c='green' size='xs'>
								Live data incoming
							</Text>
						)}
					</Stack>
				</div>
			);
		}

		const lineColor = priceMetrics?.changePercent >= 0 ? '#40c057' : '#fa5252';
		const areaColor = priceMetrics?.changePercent >= 0 ? '#40c057' : '#fa5252';

		return (
			<div
				style={{
					height: chartHeight,
					width: '100%',
					minHeight: chartHeight,
					minWidth: 300,
				}}>
				<ResponsiveContainer
					width='100%'
					height={chartHeight}
					minWidth={300}
					minHeight={chartHeight}>
					{chartType === 'area' ? (
						<AreaChart
							data={priceHistory}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							width={chartWidth}
							height={chartHeight}>
							<defs>
								<linearGradient
									id={`colorPrice-${symbol}`}
									x1='0'
									y1='0'
									x2='0'
									y2='1'>
									<stop offset='5%' stopColor={areaColor} stopOpacity={0.8} />
									<stop offset='95%' stopColor={areaColor} stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255, 255, 255, 0.1)'
							/>
							<XAxis
								dataKey='formattedTime'
								stroke='rgba(255, 255, 255, 0.5)'
								fontSize={12}
								interval='preserveStartEnd'
							/>
							<YAxis
								stroke='rgba(255, 255, 255, 0.5)'
								fontSize={12}
								domain={yAxisDomain}
								tickFormatter={(value) => `$${value.toLocaleString()}`}
							/>
							<RechartsTooltip content={<CustomTooltip />} />
							<Area
								type='monotone'
								dataKey='price'
								stroke={areaColor}
								strokeWidth={2}
								fillOpacity={1}
								fill={`url(#colorPrice-${symbol})`}
								dot={false}
								activeDot={{
									r: 4,
									stroke: areaColor,
									strokeWidth: 2,
									fill: '#fff',
								}}
							/>
						</AreaChart>
					) : (
						<LineChart
							data={priceHistory}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							width={chartWidth}
							height={chartHeight}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255, 255, 255, 0.1)'
							/>
							<XAxis
								dataKey='formattedTime'
								stroke='rgba(255, 255, 255, 0.5)'
								fontSize={12}
								interval='preserveStartEnd'
							/>
							<YAxis
								stroke='rgba(255, 255, 255, 0.5)'
								fontSize={12}
								domain={yAxisDomain}
								tickFormatter={(value) => `$${value.toLocaleString()}`}
							/>
							<RechartsTooltip content={<CustomTooltip />} />
							<Line
								type='monotone'
								dataKey='price'
								stroke={lineColor}
								strokeWidth={2}
								dot={false}
								activeDot={{
									r: 4,
									stroke: lineColor,
									strokeWidth: 2,
									fill: '#fff',
								}}
							/>
						</LineChart>
					)}
				</ResponsiveContainer>
			</div>
		);
	};

	const getPriceChangeIcon = () => {
		if (!priceMetrics) return <IconMinus size={16} />;
		const { changePercent } = priceMetrics;
		return changePercent > 0 ? (
			<IconTrendingUp size={16} />
		) : changePercent < 0 ? (
			<IconTrendingDown size={16} />
		) : (
			<IconMinus size={16} />
		);
	};

	const getPriceChangeColor = () => {
		if (!priceMetrics) return 'gray';
		const { changePercent } = priceMetrics;
		return changePercent > 0 ? 'green' : changePercent < 0 ? 'red' : 'gray';
	};

	if (!priceMetrics) {
		return (
			<Card withBorder>
				<Stack align='center' gap='md' style={{ minHeight: 260 }}>
					<IconChartLine size={48} color='var(--mantine-color-dimmed)' />
					<Text c='dimmed'>No chart data available</Text>
				</Stack>
			</Card>
		);
	}

	const yAxisDomain = getYAxisDomain();
	const priceRange = yAxisDomain[1] - yAxisDomain[0];

	return (
		<Card
			withBorder
			className={isRealTime ? 'pulse-live' : ''}
			style={{
				backgroundColor: 'rgba(255, 255, 255, 0.05)',
				border: isRealTime
					? '1px solid rgba(64, 192, 87, 0.3)'
					: '1px solid rgba(255, 255, 255, 0.1)',
				marginBottom: 20,
			}}>
			<Stack gap='md'>
				{/* Chart Header */}
				<Group justify='space-between' align='center'>
					<Box>
						<Group gap='sm'>
							<Text size='lg' fw={700} c='white'>
								{symbol.charAt(0).toUpperCase() + symbol.slice(1)}
							</Text>
							{priceMetrics && (
								<Badge
									color={getPriceChangeColor()}
									variant='light'
									leftSection={getPriceChangeIcon()}>
									{priceMetrics.changePercent > 0 ? '+' : ''}
									{priceMetrics.changePercent.toFixed(2)}%
								</Badge>
							)}
							{isRealTime && (
								<Badge variant='dot' color='green' size='sm'>
									LIVE
								</Badge>
							)}
						</Group>
						<Text size='xs' c='dimmed'>
							{priceHistory.length} data points • Range: $
							{Math.round(priceRange).toLocaleString()} •{' '}
							{isRealTime ? 'Real-time' : 'Static'} updates
						</Text>
					</Box>

					{/* Chart Controls */}
					<Group gap='xs'>
						<SegmentedControl
							size='xs'
							value={chartType}
							onChange={handleChartTypeChange}
							data={[
								{ label: 'Line', value: 'line' },
								{ label: 'Area', value: 'area' },
							]}
							style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
						/>

						<Tooltip label='Refresh chart data'>
							<ActionIcon
								variant='light'
								color='blue'
								size='sm'
								onClick={handleRefresh}>
								<IconRefresh size={16} />
							</ActionIcon>
						</Tooltip>

						<Tooltip label={isFullscreen ? 'Minimize' : 'Expand'}>
							<ActionIcon
								variant='light'
								color='gray'
								size='sm'
								onClick={toggleFullscreen}>
								{isFullscreen ? (
									<IconMinimize size={16} />
								) : (
									<IconMaximize size={16} />
								)}
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>

				{/* Chart Area */}
				<Box style={{ width: '100%' }}>{renderChart()}</Box>

				{/* Chart Statistics */}
				<Group grow>
					<Box ta='center'>
						<Text size='xs' c='dimmed'>
							Current
						</Text>
						<Text fw={600} c='white' size='sm'>
							<NumberFormatter
								value={priceMetrics?.current || 0}
								prefix='$'
								thousandSeparator
								decimalScale={2}
							/>
						</Text>
					</Box>

					<Box ta='center'>
						<Text size='xs' c='dimmed'>
							24h Change
						</Text>
						<Text fw={600} c={getPriceChangeColor()} size='sm'>
							{priceMetrics?.changePercent > 0 ? '+' : ''}
							{priceMetrics?.changePercent.toFixed(2)}%
						</Text>
					</Box>
					<Box ta='center'>
						<Text size='xs' c='dimmed'>
							Data Points
						</Text>
						<Text fw={600} c='green' size='sm'>
							{priceHistory.length}
						</Text>
					</Box>
				</Group>

				{/* Real-time Indicator */}
				{isRealTime && (
					<Group justify='center'>
						<Badge variant='dot' color='green' size='sm' className='pulse-live'>
							Live updates • Realistic price range displayed
						</Badge>
					</Group>
				)}
			</Stack>
		</Card>
	);
};

export default PriceChart;
