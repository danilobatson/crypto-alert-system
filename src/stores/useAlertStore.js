import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';

// Alert types and configurations
export const ALERT_TYPES = {
	PRICE_ABOVE: 'price_above',
	PRICE_BELOW: 'price_below',
	PERCENT_CHANGE: 'percent_change',
	VOLUME_SPIKE: 'volume_spike',
	MARKET_CAP_CHANGE: 'market_cap_change',
	SOCIAL_VOLUME_SPIKE: 'social_volume_spike',
	SENTIMENT_CHANGE: 'sentiment_change',
	TECHNICAL_INDICATOR: 'technical_indicator',
	NEWS_SENTIMENT: 'news_sentiment',
	WHALE_ACTIVITY: 'whale_activity',
	CROSS_EXCHANGE_ARBITRAGE: 'cross_exchange_arbitrage',
};

export const ALERT_STATUS = {
	ACTIVE: 'active',
	TRIGGERED: 'triggered',
	DISABLED: 'disabled',
};

// Storage keys
const STORAGE_KEYS = {
	ALERTS: 'cryptoguard-alerts',
	HISTORY: 'cryptoguard-alert-history',
	SETTINGS: 'cryptoguard-alert-settings',
};

// Clean data function to remove circular references and React elements
const cleanDataForStorage = (data) => {
	if (data === null || data === undefined) {
		return data;
	}

	if (typeof data === 'function') {
		return undefined; // Remove functions
	}

	if (typeof data === 'object') {
		// Check for React elements/fibers
		if (data.$$typeof || data._owner || data.__reactFiber$ohta0i6s1o8) {
			return undefined; // Remove React elements
		}

		// Check for DOM elements
		if (data.nodeType || data instanceof Element || data instanceof Node) {
			return undefined; // Remove DOM elements
		}

		if (Array.isArray(data)) {
			return data.map(cleanDataForStorage).filter(item => item !== undefined);
		}

		const cleanedObject = {};
		for (const [key, value] of Object.entries(data)) {
			// Skip React-specific properties
			if (key.startsWith('__react') || key.startsWith('_react') || key === '$$typeof') {
				continue;
			}
			
			const cleanedValue = cleanDataForStorage(value);
			if (cleanedValue !== undefined) {
				cleanedObject[key] = cleanedValue;
			}
		}
		return cleanedObject;
	}

	return data;
};

// Dedicated alert store with persistent storage
const useAlertStore = create(
	persist(
		subscribeWithSelector((set, get) => ({
			// Alert State
			alerts: [],
			alertHistory: [],
			isAlertModalOpen: false,
			selectedAlert: null,
			modalPrefillData: {},
			alertSettings: {
				soundEnabled: true,
				pushEnabled: true,
				emailEnabled: false,
				maxAlerts: 10,
				checkInterval: 30000, // 30 seconds
			},

			// Alert CRUD Operations
			createAlert: (alertData) => {
				const cleanAlertData = cleanDataForStorage(alertData);
				
				const newAlert = {
					id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					...cleanAlertData,
					targetValue: parseFloat(cleanAlertData.targetValue),
					status: ALERT_STATUS.ACTIVE,
					createdAt: new Date().toISOString(),
					lastChecked: null,
					triggeredAt: null,
					triggerCount: 0,
				};

				set((state) => {
					const updatedAlerts = [...state.alerts, newAlert];
					return { alerts: updatedAlerts };
				});

				return newAlert;
			},

			updateAlert: (alertId, updates) => {
				const cleanUpdates = cleanDataForStorage(updates);
				
				set((state) => {
					const updatedAlerts = state.alerts.map((alert) =>
						alert.id === alertId
							? { ...alert, ...cleanUpdates, updatedAt: new Date().toISOString() }
							: alert
					);

					return { alerts: updatedAlerts };
				});
			},

			deleteAlert: (alertId) => {
				set((state) => {
					const updatedAlerts = state.alerts.filter(
						(alert) => alert.id !== alertId
					);
					return { alerts: updatedAlerts };
				});
			},

			toggleAlert: (alertId) => {
				set((state) => {
					const updatedAlerts = state.alerts.map((alert) =>
						alert.id === alertId
							? {
									...alert,
									status:
										alert.status === ALERT_STATUS.ACTIVE
											? ALERT_STATUS.DISABLED
											: ALERT_STATUS.ACTIVE,
									updatedAt: new Date().toISOString(),
							  }
							: alert
					);
					return { alerts: updatedAlerts };
				});
			},

			// Modal Management
			openAlertModal: (prefillData = {}) => {
				const cleanPrefillData = cleanDataForStorage(prefillData);
				set({
					isAlertModalOpen: true,
					selectedAlert: null,
					modalPrefillData: cleanPrefillData,
				});
			},

			editAlert: (alert) => {
				const cleanAlert = cleanDataForStorage(alert);
				set({
					isAlertModalOpen: true,
					selectedAlert: cleanAlert,
					modalPrefillData: {},
				});
			},

			closeAlertModal: () => {
				set({
					isAlertModalOpen: false,
					selectedAlert: null,
					modalPrefillData: {},
				});
			},

			// Alert Filtering and Queries
			getActiveAlerts: () => {
				return get().alerts.filter((alert) => alert.status === ALERT_STATUS.ACTIVE);
			},

			getTriggeredAlerts: () => {
				return get().alerts.filter((alert) => alert.status === ALERT_STATUS.TRIGGERED);
			},

			getAlertsBySymbol: (symbol) => {
				return get().alerts.filter((alert) => alert.symbol.toLowerCase() === symbol.toLowerCase());
			},

			// Alert Checking System
			checkAlerts: (cryptoData) => {
				const state = get();
				const activeAlerts = state.getActiveAlerts();
				const triggeredAlerts = [];

				activeAlerts.forEach((alert) => {
					const symbolData = cryptoData[alert.symbol.toLowerCase()];
					
					if (!symbolData || !symbolData.price) {
						return; // Skip if no data available
					}

					const currentPrice = parseFloat(symbolData.price) || parseFloat(symbolData.close);
					let shouldTrigger = false;

					// Check alert condition
					switch (alert.type) {
						case ALERT_TYPES.PRICE_ABOVE:
							shouldTrigger = currentPrice >= alert.targetValue;
							break;
						case ALERT_TYPES.PRICE_BELOW:
							shouldTrigger = currentPrice <= alert.targetValue;
							break;
						case ALERT_TYPES.PERCENT_CHANGE:
							const percentChange = symbolData.percent_change_24h || 0;
							shouldTrigger = Math.abs(percentChange) >= alert.targetValue;
							break;
						case ALERT_TYPES.VOLUME_SPIKE:
							const volume = symbolData.volume_24h || 0;
							shouldTrigger = volume >= alert.targetValue;
							break;
						default:
							break;
					}

					if (shouldTrigger) {
						// Trigger the alert
						state.updateAlert(alert.id, {
							status: ALERT_STATUS.TRIGGERED,
							triggeredAt: new Date().toISOString(),
							triggerCount: (alert.triggerCount || 0) + 1,
							lastChecked: new Date().toISOString(),
						});

						// Add to history
						const historyItem = {
							id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
							alertId: alert.id,
							alertTitle: alert.title,
							symbol: alert.symbol,
							type: alert.type,
							targetValue: alert.targetValue,
							triggerPrice: currentPrice,
							triggeredAt: new Date().toISOString(),
						};

						state.addToHistory(historyItem);

						// Send browser notification if permission granted
						if ('Notification' in window && Notification.permission === 'granted') {
							new Notification(`🚨 ${alert.title}`, {
								body: `${alert.symbol.toUpperCase()} is now $${currentPrice.toLocaleString()}`,
								icon: '/favicon.ico',
								tag: `alert-${alert.id}`,
							});
						}

						triggeredAlerts.push({
							alert,
							triggerData: {
								currentPrice,
								triggeredAt: new Date().toISOString(),
							},
							currentPrice,
						});
					} else {
						// Update last checked time
						state.updateAlert(alert.id, {
							lastChecked: new Date().toISOString(),
						});
					}
				});

				return triggeredAlerts;
			},

			// Alert History Management
			addToHistory: (historyItem) => {
				const cleanHistoryItem = cleanDataForStorage(historyItem);
				
				set((state) => {
					const updatedHistory = [cleanHistoryItem, ...state.alertHistory].slice(0, 100); // Keep last 100 items
					return { alertHistory: updatedHistory };
				});
			},

			clearTriggeredAlerts: () => {
				set((state) => {
					const updatedAlerts = state.alerts.map((alert) =>
						alert.status === ALERT_STATUS.TRIGGERED
							? { ...alert, status: ALERT_STATUS.ACTIVE }
							: alert
					);
					return { alerts: updatedAlerts };
				});
			},

			getRecentHistory: (limit = 10) => {
				return get().alertHistory.slice(0, limit);
			},

			// Settings Management
			updateSettings: (newSettings) => {
				const cleanSettings = cleanDataForStorage(newSettings);
				
				set((state) => ({
					alertSettings: { ...state.alertSettings, ...cleanSettings },
				}));
			},

			// Utility Methods
			getAlertStats: () => {
				const alerts = get().alerts;
				return {
					total: alerts.length,
					active: alerts.filter((a) => a.status === ALERT_STATUS.ACTIVE).length,
					triggered: alerts.filter((a) => a.status === ALERT_STATUS.TRIGGERED).length,
					disabled: alerts.filter((a) => a.status === ALERT_STATUS.DISABLED).length,
				};
			},
		})),
		{
			name: STORAGE_KEYS.ALERTS,
			// Custom serializer/deserializer to handle the cleaning
			serialize: (state) => {
				try {
					const cleanState = cleanDataForStorage(state.state);
					return JSON.stringify(cleanState);
				} catch (error) {
					console.warn('Failed to serialize alert state:', error);
					return JSON.stringify({
						alerts: [],
						alertHistory: [],
						isAlertModalOpen: false,
						selectedAlert: null,
						modalPrefillData: {},
						alertSettings: {
							soundEnabled: true,
							pushEnabled: true,
							emailEnabled: false,
							maxAlerts: 10,
							checkInterval: 30000,
						},
					});
				}
			},
			deserialize: (str) => {
				try {
					return JSON.parse(str);
				} catch (error) {
					console.warn('Failed to deserialize alert state:', error);
					return {
						state: {
							alerts: [],
							alertHistory: [],
							isAlertModalOpen: false,
							selectedAlert: null,
							modalPrefillData: {},
							alertSettings: {
								soundEnabled: true,
								pushEnabled: true,
								emailEnabled: false,
								maxAlerts: 10,
								checkInterval: 30000,
							},
						},
					};
				}
			},
		}
	)
);

export default useAlertStore;
