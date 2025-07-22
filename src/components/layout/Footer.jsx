import {
	Box,
	Container,
	Group,
	Text,
	Stack,
	Badge,
	ActionIcon,
	Divider,
	Flex,
	Anchor,
} from '@mantine/core';
import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandTwitter,
	IconMail,
	IconExternalLink,
	IconHeart,
} from '@tabler/icons-react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			style={{
				background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
				borderTop: '1px solid rgba(255, 255, 255, 0.1)',
				paddingTop: '60px',
				paddingBottom: '40px',
			}}>
			<Container
				size='xl'
				style={{ maxWidth: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
				<Stack spacing='xl'>
					{/* Main Footer Content */}
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify='space-between'
						align={{ base: 'center', md: 'flex-start' }}
						gap='xl'>
						{/* Brand Section */}
						<Stack spacing='md' align={{ base: 'center', md: 'flex-start' }}>
							<Text
								size='xl'
								weight={900}
								style={{
									background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}>
								🚀 CryptoGuard
							</Text>
							<Text
								color='dimmed'
								size='sm'
								style={{
									maxWidth: '300px',
									textAlign: { base: 'center', md: 'left' },
								}}>
								Cryptocurrency alert system built with
								LunarCrush API for real-time accuracy.
							</Text>
							<Group spacing='md' style={{ alignSelf: 'center' }}>
								<Badge variant='outline' color='purple' size='sm'>
									LunarCrush API
								</Badge>
							</Group>
						</Stack>

						{/* Tech Stack */}
						<Stack spacing='md' align={{ base: 'center', md: 'flex-start' }}>
							<Text weight={600} color='white' size='md'>
								Tech Stack
							</Text>
							<Stack spacing='xs' style={{ alignItems: 'center' }}>
								<Anchor
									href='https://reactjs.org'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									React 18 <IconExternalLink size={12} />
								</Anchor>

								<Anchor
									href='https://lunarcrush.com/about/api'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									LunarCrush API <IconExternalLink size={12} />
								</Anchor>
								<Anchor
									href='https://workers.cloudflare.com'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									Cloudflare Workers <IconExternalLink size={12} />
								</Anchor>
							</Stack>
						</Stack>

						{/* Developer */}
						<Stack spacing='md' align={{ base: 'center', md: 'flex-start' }}>
							<Text weight={600} color='white' size='md'>
								Developer
							</Text>
							<Stack spacing='xs' style={{ alignItems: 'center' }}>
								<Anchor
									href='https://danilobatson.github.io'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									Portfolio <IconExternalLink size={12} />
								</Anchor>
								<Anchor
									href='https://github.com/danilobatson'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									GitHub Projects <IconExternalLink size={12} />
								</Anchor>
								<Anchor
									href='mailto:djbatson19@gmail.com'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									Contact <IconMail size={12} />
								</Anchor>
							</Stack>
						</Stack>

						{/* Resources */}
						<Stack spacing='md' align={{ base: 'center', md: 'flex-start' }}>
							<Text weight={600} color='white' size='md'>
								Resources
							</Text>
							<Stack spacing='xs' style={{ alignItems: 'center' }}>
								<Anchor
									href='https://github.com/danilobatson/crypto-alert-system'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									Source Code <IconExternalLink size={12} />
								</Anchor>
								<Anchor
									href='https://dev.to/danilobatson'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									Tutorial Article <IconExternalLink size={12} />
								</Anchor>
								<Anchor
									href='https://lunarcrush.com/developers'
									target='_blank'
									color='dimmed'
									size='sm'
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									API Documentation <IconExternalLink size={12} />
								</Anchor>
							</Stack>
						</Stack>
					</Flex>

					<Divider color='rgba(255, 255, 255, 0.1)' />

					{/* Bottom Footer */}
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align='center'
						gap='md'>
						<Text
							size='sm'
							color='dimmed'
							style={{ textAlign: { base: 'center', sm: 'left' } }}>
							© {currentYear} Built with{' '}
							<IconHeart
								size={14}
								color='#ef4444'
								style={{ display: 'inline', verticalAlign: 'middle' }}
							/>{' '}
							by{' '}
							<Anchor
								href='https://danilobatson.github.io'
								target='_blank'
								color='blue'
								weight={500}>
								Danilo Jamaal
							</Anchor>
						</Text>

						{/* Social Links */}
						<Group spacing='md'>
							<ActionIcon
								variant='light'
								color='gray'
								size='lg'
								onClick={() =>
									window.open(
										'https://github.com/danilobatson/crypto-alert-system',
										'_blank'
									)
								}>
								<IconBrandGithub size={18} />
							</ActionIcon>
							<ActionIcon
								variant='light'
								color='gray'
								size='lg'
								onClick={() =>
									window.open('https://linkedin.com/in/danilo-batson', '_blank')
								}>
								<IconBrandLinkedin size={18} />
							</ActionIcon>
							<ActionIcon
								variant='light'
								color='gray'
								size='lg'
								onClick={() =>
									window.open('mailto:djbatson19@gmail.com', '_blank')
								}>
								<IconMail size={18} />
							</ActionIcon>
						</Group>

						{/* Feature Highlights */}
						<Group
							spacing='md'
							style={{ display: { base: 'none', sm: 'flex' } }}>
							<Text size='xs' color='dimmed'>
								✅ Real-time Data
							</Text>
							<Text size='xs' color='dimmed'>
								🔔 Browser Notifications
							</Text>
						</Group>
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
};

export default Footer;
