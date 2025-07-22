import { Card, Group, Text, Stack, Badge, NumberFormatter } from '@mantine/core'
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'

const HeroSection = ({ cryptoData, isRealTime }) => {
  const bitcoin = cryptoData?.bitcoin || {}
  const ethereum = cryptoData?.ethereum || {}

  const totalValue = (bitcoin.price || 0) + (ethereum.price || 0)
  const avgChange = ((bitcoin.percent_change_24h || 0) + (ethereum.percent_change_24h || 0)) / 2
  const isPositive = avgChange > 0

  return (
		<Card
			className='hero-section'
			style={{
				background:
					'linear-gradient(135deg, rgba(247, 147, 26, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
				backdropFilter: 'blur(20px)',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				borderRadius: '16px',
				padding: '1.5rem',
				marginBottom: '1.5rem',
			}}>
			<Stack gap='md'>
				<Group justify='space-between' align='center'>
					<div>
						<Text size='xl' fw={700} c='white'>
							🚀 Portfolio Overview
						</Text>
						<Badge
							color={isRealTime ? 'green' : 'gray'}
							variant='light'
							size='sm'>
							{isRealTime ? 'LIVE DATA' : 'CACHED DATA'}
						</Badge>
					</div>

					<div style={{ textAlign: 'right' }}>
						<Text size='xs' c='dimmed'>
							Total Portfolio Value
						</Text>
						<Text size='xl' fw={700} c='white'>
							<NumberFormatter
								value={totalValue}
								prefix='$'
								thousandSeparator
								decimalScale={2}
							/>
						</Text>
						<Group gap={4} justify='flex-end'>
							{isPositive ? (
								<IconTrendingUp size={16} color='#10B981' />
							) : (
								<IconTrendingDown size={16} color='#EF4444' />
							)}
							<Text size='sm' c={isPositive ? 'green' : 'red'} fw={600}>
								{isPositive ? '+' : ''}
								{avgChange.toFixed(2)}%
							</Text>
						</Group>
					</div>
				</Group>

				<Group grow>
					<Card
						className='gradient-border'
						style={{
							background: 'rgba(247, 147, 26, 0.1)',
							textAlign: 'center',
						}}>
						<Text size='xs' c='dimmed'>
							Bitcoin
						</Text>
						<Text fw={700} c='white'>
							<NumberFormatter
								value={bitcoin.price || 0}
								prefix='$'
								thousandSeparator
								decimalScale={2}
							/>
						</Text>
					</Card>
					<Card
						className='gradient-border'
						style={{
							background: 'rgba(59, 130, 246, 0.1)',
							textAlign: 'center',
						}}>
						<Text size='xs' c='dimmed'>
							Ethereum
						</Text>
						<Text fw={700} c='white'>
							<NumberFormatter
								value={ethereum.price || 0}
								prefix='$'
								thousandSeparator
								decimalScale={2}
							/>
						</Text>
					</Card>

				</Group>
			</Stack>
		</Card>
	);
}

export default HeroSection
