import { useState, useEffect } from 'react';
import {
	AppShell,
	Group,
	Text,
	Button,
	Container,
	Title,
	Badge,
	Box,
	Tooltip,
	ActionIcon,
} from '@mantine/core';
import {
	IconCoin,
	IconBell,
	IconSettings,
	IconBrandGithub,
	IconExternalLink,
} from '@tabler/icons-react';
import DashboardGrid from './components/dashboard/DashboardGrid';
import AlertModal from './components/alerts/AlertModal';
import useCryptoStore from './stores/useCryptoStore';
import useAlertStore from './stores/useAlertStore';
import useNotifications from './hooks/useNotifications.jsx';
import useAlertInitialization from './hooks/useAlertInitialization';

function App() {
	const { notifications, addNotification, validateAllData } = useCryptoStore();
	const { getActiveAlerts } = useAlertStore();

	// Initialize notification system
	useNotifications();

	// Initialize alert system with persistence
	const { isInitialized, activeAlertsCount } = useAlertInitialization();

	// REAL DATA ONLY - Welcome notification
	useEffect(() => {
		const timer = setTimeout(() => {
			addNotification({
				type: 'success',
				title: '🚀 CryptoGuard v6.0 - Real Data Only!',
				message: 'Now using 100% real LunarCrush API data. No more mock data!',
			});

			// Validate all data is real
			validateAllData();
		}, 1000);

		return () => clearTimeout(timer);
	}, [addNotification, validateAllData]);

	const handleSetupAlerts = () => {
		addNotification({
			type: 'info',
			title: 'Real Alert System Active',
			message: 'Create alerts with real-time LunarCrush data!',
		});
	};

	const handleViewGitHub = () => {
		addNotification({
			type: 'info',
			title: 'Cursor vs Windsurf IDE Battle',
			message: 'Source code available after the AI IDE comparison is complete!',
		});
	};

	return (
		<>
			<AppShell padding='md'>
				<AppShell.Header height={70}>
					<Container size='xl' h='100%'>
						<Group h='100%' justify='space-between' align='center'>
							{/* Logo Section */}
							<Group gap='md'>
								<Box
									style={{
										background:
											'linear-gradient(135deg, #F7931A 0%, #FFB84D 100%)',
										borderRadius: '12px',
										padding: '8px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<IconCoin size={28} color='white' />
								</Box>

								<Box>
									<Title order={2} size='h3' fw={700} c='white'>
										CryptoGuard
									</Title>
								</Box>
							</Group>

							{/* Center Section - Connection Status */}

							{/* Right Section */}
							<Group gap='md'>
								{/* Alert Counter */}
								{activeAlertsCount > 0 && (
									<Tooltip
										label={`${activeAlertsCount} active alerts monitoring real prices`}>
										<Badge
											variant='filled'
											color={activeAlertsCount > 3 ? 'orange' : 'blue'}
											leftSection={<IconBell size={12} />}
											size='lg'>
											{activeAlertsCount} real alerts
										</Badge>
									</Tooltip>
								)}

								{/* Storage Status Indicator */}
								{isInitialized && (
									<Tooltip label='Alerts are saved and will persist across browser sessions'>
										<Badge variant='light' color='green' size='sm'>
											💾 Saved
										</Badge>
									</Tooltip>
								)}


                

								{/* Settings */}
								<Tooltip label='Settings'>
									<ActionIcon
										variant='light'
										color='gray'
										size='lg'
										onClick={() =>
											addNotification({
												type: 'info',
												title: 'Settings',
												message:
													'Advanced settings panel coming in next update!',
											})
										}>
										<IconSettings size={18} />
									</ActionIcon>
								</Tooltip>

								{/* GitHub */}
								<Tooltip label='View source code'>
									<ActionIcon
										variant='light'
										color='gray'
										size='lg'
										onClick={handleViewGitHub}>
										<IconBrandGithub size={18} />
									</ActionIcon>
								</Tooltip>
							</Group>
						</Group>
					</Container>
				</AppShell.Header>

				<AppShell.Main>
					<Container size='xl'>
						<DashboardGrid />
					</Container>
				</AppShell.Main>
			</AppShell>

			{/* Alert Modal - Rendered globally */}
			<AlertModal />
		</>
	);
}

export default App;
