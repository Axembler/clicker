import { PassiveIncomeToast } from '@/components/passiveIncomeToast'
import { useAppLifecycle } from '@/hooks/use-app-lifecycle'
import { getCounter, incrementCounter } from '@/services/counter'
import { deleteToken } from '@/utils/token'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface ToastState {
  earned: number
  seconds: number
  key: number
}

interface WakeUpParams {
  passiveEarned: number
  passiveSeconds: number
}

export default function HomeScreen() {
  const router = useRouter()
  const [count, setCount] = useState(0)
  const [loadingCounter, setLoadingCounter] = useState(true)
  const [toast, setToast] = useState<ToastState>({
    earned: 0,
    seconds: 0,
    key: 0
  })

  const scaleAnim = useRef(new Animated.Value(1)).current

  const pulse = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start()
  }

  const loadCounter = async () => {
    try {
      const { clicks } = await getCounter()

      setCount(clicks)
    } catch (error) {
      console.log('Ошибка загрузки:', error)
    } finally {
      setLoadingCounter(false)
    }
  }

  const increment = async () => {
    pulse()

    try {
      const { clicks } = await incrementCounter()

      setCount(clicks)
    } catch (error) {
      console.log('Ошибка:', error)
    }
  }

  const handleLogout = async () => {
    await deleteToken()

    router.replace('/login')
  }

  useEffect(() => {
    loadCounter()
  }, [])

  const handleWakeUp = useCallback(({ passiveEarned, passiveSeconds }: WakeUpParams) => {
    if (passiveEarned > 0) {
      setToast(prev => ({
        earned: passiveEarned,
        seconds: passiveSeconds,
        key: prev.key + 1
      }))
    }
  }, [])

  useAppLifecycle({ onWakeUp: handleWakeUp })

  if (loadingCounter) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Уведомление о пассивном доходе */}
      <PassiveIncomeToast
        key={toast.key}
        earned={toast.earned}
        seconds={toast.seconds}
      />

      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      <Text style={styles.title}>Счетчик</Text>
      <Text style={styles.subtitle}>Нажимай и считай 🎯</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Всего нажатий</Text>
        <Text style={styles.number}>{count}</Text>

        <View style={styles.dots}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { opacity: i < (count % 5 === 0 && count > 0 ? 5 : count % 5) ? 1 : 0.2 },
              ]}
            />
          ))}
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.button} onPressIn={increment} activeOpacity={0.85}>
          <Text style={styles.buttonEmoji}>👆</Text>
          <Text style={styles.buttonText}>Нажми меня</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.logoutButton} onPressIn={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    gap: 12,
  },
  loadingText: {
    color: '#A78BFA',
    fontSize: 16,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 24,
  },

  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  circleTopLeft: {
    width: 280,
    height: 280,
    backgroundColor: '#C4B5FD',
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    width: 220,
    height: 220,
    backgroundColor: '#FBCFE8',
    bottom: -60,
    right: -60,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4C1D95',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#A78BFA',
    marginBottom: 40,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    minWidth: 260,
  },
  cardLabel: {
    fontSize: 13,
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 8,
  },
  number: {
    fontSize: 88,
    fontWeight: '800',
    color: '#5B21B6',
    lineHeight: 96,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A78BFA',
  },

  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonEmoji: {
    fontSize: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: '#C4B5FD',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: '#C4B5FD',
  },
})
