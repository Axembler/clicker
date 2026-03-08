import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuth } from '@/context/auth-context'
import { useUserContext } from '@/context/user-context'
import { formatNumber } from '@/helpers/formatNumber'
import { useClickBatcher } from '@/hooks/use-click-batcher'
import { incrementCounter } from '@/services/counter'
import { SignOutModal } from '@/components/SignOutModal'
import { useModal } from '@/context/modal-context'
import { useAchievementQueue } from '@/hooks/use-achievement-queue'
import { checkAchievements } from '@/services/achievements'

type LocalStats = {
  localClicks: number
  localCoins: number
}

const LoadingView = memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#A78BFA" />
    <Text style={styles.loadingText}>Загрузка...</Text>
  </View>
))

const ErrorView = memo(({ message }: { message: string }) => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>{message}</Text>
  </View>
))

export default function HomeScreen() {
  const isInitialized = useRef(false)
  const prevCoinsRef = useRef<number | null>(null)
  const { user, isLoading, error, setUser, refetchUser } = useUserContext()
  const { signOut } = useAuth()
  const { showModal, hideModal } = useModal()
  const { enqueue } = useAchievementQueue()

  const [stats, setStats] = useState<LocalStats>({ localClicks: 0, localCoins: 0 })

  const activeDots = useMemo(
    () => (stats.localClicks % 5 === 0 && stats.localClicks > 0 ? 5 : stats.localClicks % 5),
    [stats.localClicks]
  )

  const scaleAnim = useRef(new Animated.Value(1)).current

  const pulse = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start()
  }, [scaleAnim])

  const handleSignOut = () => {
    showModal(
      <SignOutModal
        onCancel={hideModal}
        onConfirm={() => {
          hideModal()
          signOut()
        }}
      />
    )
  }

  const { registerClick } = useClickBatcher(async (rClicks: number) => {
    const { coins, clicks } = await incrementCounter(rClicks)

    setStats({ localClicks: clicks, localCoins: coins })

    setUser((prev) => prev ? { ...prev, coins } : null)

    const { newAchievements } = await checkAchievements()

    if (newAchievements.length > 0) {
      enqueue(newAchievements)

      await refetchUser()
    }
  })

  const increment = useCallback(async () => {
    pulse()

    setStats((prev) => ({
      localClicks: prev.localClicks + 1,
      localCoins: prev.localCoins + (user?.clickPower ?? 1)
    }))

    registerClick()
  }, [pulse, registerClick, user?.clickPower])

  useEffect(() => {
    if (!user) return

    // Первичная инициализация
    if (!isInitialized.current) {
      setStats({ localClicks: user.clicks, localCoins: user.coins })

      isInitialized.current = true

      prevCoinsRef.current = user.coins

      return
    }

    // Если coins изменились извне
    if (prevCoinsRef.current !== user.coins) {
      setStats(prev => ({ ...prev, localCoins: user.coins }))

      prevCoinsRef.current = user.coins
    }
  }, [user])

  if (isLoading) return <LoadingView />
  if (error) return <ErrorView message={error} />

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleSignOut}
        activeOpacity={0.6}
      >
        <Text style={styles.logoutText}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⚡</Text>
          <Text style={styles.statValue}>{user?.clickPower}</Text>
          <Text style={styles.statLabel}>за клик</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💰</Text>
          <Text style={styles.statValue}>{user?.passiveIncome}</Text>
          <Text style={styles.statLabel}>в секунду</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💰</Text>
          <Text style={styles.statValue}>{formatNumber(stats.localCoins)}</Text>
          <Text style={styles.statLabel}>баланс</Text>
        </View>
      </View>

      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      <Text style={styles.title}>Счетчик</Text>
      <Text style={styles.subtitle}>Нажимай и считай 🎯</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Всего нажатий</Text>
        <Text
          style={styles.number}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {stats.localClicks}
        </Text>

        <View style={styles.dots}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { opacity: i < activeDots ? 1 : 0.2 }]}
            />
          ))}
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={increment}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonEmoji}>👆</Text>
          <Text style={styles.buttonText}>Нажми меня</Text>
        </TouchableOpacity>
      </Animated.View>
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

  logoutButton: {
    position: 'absolute',
    top: 36,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 18,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 32,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 24,
  },
  statCard: {
    alignItems: 'center',
    gap: 1,
  },
  statEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5B21B6',
  },
  statLabel: {
    fontSize: 10,
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EDE9FE',
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
    fontSize: 80,
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
  }
})
