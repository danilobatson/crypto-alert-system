import { useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import useCryptoStore from '../stores/useCryptoStore'

const useNotifications = () => {
  const { notifications: storeNotifications, clearNotifications } = useCryptoStore()

  useEffect(() => {
    // Display new notifications
    storeNotifications.forEach((notification) => {
      // Only show notifications that haven't been shown yet
      if (!notification.shown) {
        const notificationConfig = {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          color: getNotificationColor(notification.type),
          autoClose: getAutoCloseDelay(notification.type),
          withCloseButton: true,
          onClose: () => {
            // Mark notification as handled when closed
            console.log('Notification closed:', notification.id)
          }
        }

        // Show the notification
        notifications.show(notificationConfig)
        
        // Mark as shown
        notification.shown = true
      }
    })
  }, [storeNotifications])

  // Auto-cleanup old notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      clearNotifications()
    }, 30000) // Clear every 30 seconds

    return () => clearInterval(cleanup)
  }, [clearNotifications])

  return null
}

// Helper functions
const getNotificationColor = (type) => {
  switch (type) {
    case 'success': return 'green'
    case 'error': return 'red'
    case 'warning': return 'orange'
    case 'info': return 'blue'
    default: return 'blue'
  }
}

const getAutoCloseDelay = (type) => {
  switch (type) {
    case 'success': return 4000
    case 'error': return 7000
    case 'warning': return 6000
    case 'info': return 5000
    default: return 5000
  }
}

export default useNotifications
