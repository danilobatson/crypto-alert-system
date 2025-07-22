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
	Loader,
	ActionIcon,
	Tooltip,
} from '@mantine/core';
import {
	IconBell,
	IconTrendingUp,
	IconAlertTriangle,
	IconChartLine,
	IconBrandGithub,
	IconX,
} from '@tabler/icons-react';
import { useMultipleCrypto } from '../../hooks/useCryptoData';
import useAlertStore from '../../stores/useAlertStore';

const HeroSection = () => {
	const { data: cryptoData, isLoading } = useMultipleCrypto([
		'bitcoin',
		'ethereum',
	]);
	const { openAlertModal, alerts } = useAlertStore();

	const bitcoin = cryptoData?.bitcoin;
	const ethereum = cryptoData?.ethereum;
	const activeAlertsCount =
		alerts?.filter((alert) => alert.isActive)?.length || 0;

	const handleCreateAlert = () => {
		openAlertModal();
	};

	const handleViewGitHub = () => {
		window.open(
			'https://github.com/danilobatson/crypto-alert-system',
			'_blank'
		);
	};

	return (
		<Box
			style={{
				background: 'linear-gradient(135deg, #1a1b23 0%, #2d3748 100%)',
				borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
				paddingTop: '20px',
				paddingBottom: '40px',
				width: '100%',
			}}>
			<Container
				size='xl'
				style={{
					maxWidth: '100%',
					paddingLeft: { base: '20px', md: '40px' },
					paddingRight: { base: '20px', md: '40px' },
				}}>
				<Stack spacing={{ base: 'md', md: 'xl' }} align='center'>
					{/* Top Title Button - Mobile Optimized */}
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align='center'
						gap='md'
						style={{ width: '100%', marginBottom: '10px' }}>
						<Badge
							size={{ base: 'md', md: 'lg' }}
							variant='filled'
							color='dark'
							style={{
								background: 'rgba(255, 255, 255, 0.1)',
								color: 'white',
								padding: { base: '6px 12px', md: '8px 16px' },
								borderRadius: '20px',
								fontSize: { base: '12px', md: '14px' },
								fontWeight: 600,
								border: '1px solid rgba(255, 255, 255, 0.2)',
							}}>
							✕ CRYPTO ALERT SYSTEM
						</Badge>

						{/* GitHub Link */}
						<Tooltip label='View source code'>
							<ActionIcon
								variant='light'
								color='gray'
								size={{ base: 'md', md: 'lg' }}
								onClick={handleViewGitHub}
								style={{
									background: 'rgba(255, 255, 255, 0.1)',
									color: 'white',
									border: '1px solid rgba(255, 255, 255, 0.2)',
								}}>
								<IconBrandGithub size={{ base: 16, md: 18 }} />
							</ActionIcon>
						</Tooltip>
					</Flex>

					{/* Main Headline - Mobile Responsive */}
					<Stack spacing='md' align='center' style={{ textAlign: 'center' }}>
						<Title
							order={1}
							weight={900}
							style={{
								background: 'linear-gradient(45deg, #ffffff, #a0aec0)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								lineHeight: 1.1,
								maxWidth: '900px',
								padding: { base: '0 10px', md: '0' },
							}}>
							Never Miss a Crypto Opportunity Again
						</Title>

						<Text
							size={{ base: 'md', md: 'xl' }}
							color='dimmed'
							style={{
								maxWidth: '700px',
								lineHeight: 1.6,
								padding: { base: '0 10px', md: '0' },
							}}>
							Get instant browser notifications when Bitcoin, Ethereum, or any
							crypto hits your price targets. Built LunarCrush API for real-time
							accuracy.
						</Text>
					</Stack>

					{/* Live Data Cards - Mobile Stack */}
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						gap={{ base: 'md', md: 'lg' }}
						style={{
							marginTop: '20px',
							width: '100%',
							justifyContent: 'center',
						}}>
						<Card
							padding='md'
							radius='md'
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								minWidth: { base: 'auto', sm: '200px' },
								width: { base: '100%', sm: 'auto' },
							}}>
							<Flex direction='column' align='center'>
								<Group spacing='xs' mb='xs'>
									<IconChartLine size={20} color='#f59e0b' />
									<Text weight={600} color='white'>
										Bitcoin
									</Text>
									<Badge
										size='xs'
										color={bitcoin?.percent_change_24h >= 0 ? 'green' : 'red'}>
										LIVE
									</Badge>
								</Group>
								{isLoading || !bitcoin ? (
									<Loader size='sm' />
								) : (
									<>
										<Text
											size={{ base: 'md', md: 'lg' }}
											weight={700}
											color='white'>
											<NumberFormatter
												value={bitcoin.price}
												prefix='$'
												thousandSeparator
												decimalScale={2}
											/>
										</Text>
										<Text
											size='sm'
											color={bitcoin.percent_change_24h >= 0 ? 'green' : 'red'}
											weight={500}>
											{bitcoin.percent_change_24h >= 0 ? '+' : ''}
											{bitcoin.percent_change_24h?.toFixed(2)}% 24h
										</Text>
									</>
								)}
							</Flex>
						</Card>

						<Card
							padding='md'
							radius='md'
							style={{
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								minWidth: { base: 'auto', sm: '200px' },
								width: { base: '100%', sm: 'auto' },
							}}>
							<Flex direction='column' align='center'>
								<Group spacing='xs' mb='xs'>
									<IconChartLine size={20} color='#8b5cf6' />
									<Text weight={600} color='white'>
										Ethereum
									</Text>
									<Badge
										size='xs'
										color={ethereum?.percent_change_24h >= 0 ? 'green' : 'red'}>
										LIVE
									</Badge>
								</Group>
								{isLoading || !ethereum ? (
									<Loader size='sm' />
								) : (
									<>
										<Text
											size={{ base: 'md', md: 'lg' }}
											weight={700}
											color='white'>
											<NumberFormatter
												value={ethereum.price}
												prefix='$'
												thousandSeparator
												decimalScale={2}
											/>
										</Text>
										<Text
											size='sm'
											color={ethereum.percent_change_24h >= 0 ? 'green' : 'red'}
											weight={500}>
											{ethereum.percent_change_24h >= 0 ? '+' : ''}
											{ethereum.percent_change_24h?.toFixed(2)}% 24h
										</Text>
									</>
								)}
							</Flex>
						</Card>

						{activeAlertsCount > 0 && (
							<Card
								padding='md'
								radius='md'
								style={{
									background: 'rgba(34, 197, 94, 0.1)',
									border: '1px solid rgba(34, 197, 94, 0.2)',
									minWidth: { base: 'auto', sm: '200px' },
									width: { base: '100%', sm: 'auto' },
								}}>
								<Flex direction='column' align='center'>
									<Group spacing='xs' mb='xs'>
										<IconBell size={20} color='#22c55e' />
										<Text weight={600} color='white'>
											Active Alerts
										</Text>
									</Group>
									<Text
										size={{ base: 'md', md: 'lg' }}
										weight={700}
										color='#22c55e'>
										{activeAlertsCount}
									</Text>
									<Text size='sm' color='dimmed'>
										Monitoring prices
									</Text>
								</Flex>
							</Card>
						)}
					</Flex>

					{/* Call to Action - Mobile Stack */}
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						gap='md'
						style={{ marginTop: '30px', width: { base: '100%', sm: 'auto' } }}>
						<Button
							size='md'
							leftSection={<IconBell size={20} />}
							variant='gradient'
							gradient={{ from: 'blue', to: 'cyan' }}
							onClick={handleCreateAlert}
							fullWidth={{ base: true, sm: false }}>
							Create Your First Alert
						</Button>
					</Flex>

					{/* Trust Indicators - Mobile Wrap */}
					<Flex
						wrap='wrap'
						gap={{ base: 'xs', md: 'lg' }}
						justify='center'
						style={{ marginTop: '20px' }}>
						<Badge
							variant='outline'
							color='gray'
							size={{ base: 'sm', md: 'md' }}>
							⚡ Real-time LunarCrush API
						</Badge>
						<Badge
							variant='outline'
							color='gray'
							size={{ base: 'sm', md: 'md' }}>
							🔔 Browser Notifications
						</Badge>
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
};

export default HeroSection;
