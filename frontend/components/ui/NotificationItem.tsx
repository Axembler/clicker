import { Notification, NotificationType } from '@/context/notification-context'
import React, { useEffect, useRef, useCallback } from 'react'
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const CONFIG: Record<NotificationType, { bg: string; border: string; icon: string; label: string }> = {
  success: {
    bg: '#F0FDF4',
    border: '#22C55E',
    icon: '✓',
    label: 'Успешно',
  },
  error: {
    bg: '#FEF2F2',
    border: '#EF4444',
    icon: '✕',
    label: 'Ошибка',
  },
  warning: {
    bg: '#FFFBEB',
    border: '#F59E0B',
    icon: '⚠',
    label: 'Внимание',
  },
  info: {
    bg: '#EFF6FF',
    border: '#3B82F6',
    icon: 'i',
    label: 'Инфо',
  },
}

interface Props {
  notification: Notification
  onDismiss: (id: string) => void
}

export const NotificationItem = ({ notification, onDismiss }: Props) => {
  const { id, type, message, options } = notification
  const config = CONFIG[type]

  const translateY = useRef(new Animated.Value(-20)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.95)).current

  const progress = useRef(new Animated.Value(1)).current

  const animateOut = useCallback(
    (callback: () => void) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -12,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(callback)
    },
    [opacity, scale, translateY],
  )

  const handleDismiss = useCallback(() => {
    animateOut(() => onDismiss(id))
  }, [animateOut, id, onDismiss])

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 70,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 70,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start()

    Animated.timing(progress, {
      toValue: 0,
      duration: options.duration,
      useNativeDriver: false,
    }).start()
  }, [])

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <Animated.View style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderLeftColor: config.border,
          opacity,
          transform: [{ translateY }, { scale }],
        },
    ]}>
      <View style={styles.body}>
        {options.showIcon && (
          <View style={[styles.iconWrapper, { backgroundColor: config.border }]}>
            <Text style={styles.iconText}>{config.icon}</Text>
          </View>
        )}

        <View style={styles.textWrapper}>
          <Text style={[styles.label, { color: config.border }]}>
            {config.label}
          </Text>
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>
        </View>

        <Pressable
          onPress={handleDismiss}
          hitSlop={8}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.progressBar,
          { width: progressWidth, backgroundColor: config.border },
        ]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderLeftWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
  closeButtonPressed: {
    opacity: 0.5,
  },
  closeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  progressBar: {
    height: 3,
    borderRadius: 0,
  },
})
