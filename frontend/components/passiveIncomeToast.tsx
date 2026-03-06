// components/PassiveIncomeToast.tsx
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'

interface Props {
  earned: number
  seconds: number
}

export const PassiveIncomeToast = ({ earned, seconds }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (earned <= 0) return

    opacity.setValue(0)

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [earned])

  if (earned <= 0) return null

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeLabel = minutes > 0 ? `${minutes} мин ${secs} сек` : `${secs} сек`

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.title}>Пока тебя не было:</Text>
      <Text style={styles.earned}>+{earned} монет 💰</Text>
      <Text style={styles.time}>за {timeLabel}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
  },
  earned: {
    color: '#f1c40f',
    fontSize: 22,
    fontWeight: 'bold',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
})
