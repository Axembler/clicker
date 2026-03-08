import { NotificationItem } from '@/components/ui/NotificationItem'
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react'
import { StyleSheet, View } from 'react-native'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationOptions {
  duration?: number
  showIcon?: boolean
}

export interface Notification {
  id: string
  type: NotificationType
  message: string
  options: Required<NotificationOptions>
}

interface NotificationContextType {
  notify: (
    type: NotificationType,
    message: string,
    options?: NotificationOptions,
  ) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
  dismiss: () => {},
  dismissAll: () => {},
})

export const useNotification = () => useContext(NotificationContext)

const DEFAULT_OPTIONS: Required<NotificationOptions> = {
  duration: 3500,
  showIcon: true,
}

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout)
    timers.current = {}
    setNotifications([])
  }, [])

  const notify = useCallback(
    (
      type: NotificationType,
      message: string,
      options?: NotificationOptions,
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const merged: Required<NotificationOptions> = {
        ...DEFAULT_OPTIONS,
        ...options,
      }

      setNotifications((prev) => [...prev, { id, type, message, options: merged }])

      timers.current[id] = setTimeout(() => dismiss(id), merged.duration)
    },
    [dismiss],
  )

  return (
    <NotificationContext.Provider value={{ notify, dismiss, dismissAll }}>
      {children}

      <View style={styles.container} pointerEvents="box-none">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
          />
        ))}
      </View>
    </NotificationContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    gap: 8,
    zIndex: 9999
  }
})
