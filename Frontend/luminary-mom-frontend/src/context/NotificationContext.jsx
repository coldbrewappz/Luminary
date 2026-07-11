import { useCallback, useRef, useState } from 'react'
import Notification from '../components/Notification'
import NotificationContext from './notificationStore'

export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null)
  const timeoutRef = useRef(null)

  const dismissNotification = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setNotification(null)
  }, [])

  const notify = useCallback((nextNotification) => {
    window.clearTimeout(timeoutRef.current)
    setNotification(nextNotification)

    const duration = nextNotification.duration ?? 0
    if (duration > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setNotification(null)
        timeoutRef.current = null
      }, duration)
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notify, dismissNotification }}>
      {children}
      <Notification notification={notification} onDismiss={dismissNotification} />
    </NotificationContext.Provider>
  )
}
