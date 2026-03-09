import { useRef, useState, useCallback } from 'react'
import { Animated } from 'react-native'

interface FloatingNumber {
  id: number
  x: number
  y: number
  translateY: Animated.Value
  opacity: Animated.Value
  scale: Animated.Value
  label: string
}

export function useFloatingNumbers() {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([])
  const counterRef = useRef(0)

  const spawnNumber = useCallback((x: number, y: number, label = '+1') => {
    const id = counterRef.current++

    const offsetX = (Math.random() - 0.5) * 40

    const translateY = new Animated.Value(0)
    const opacity = new Animated.Value(1)
    const scale = new Animated.Value(0.5)

    const particle: FloatingNumber = {
      id,
      x: x + offsetX,
      y,
      translateY,
      opacity,
      scale,
      label,
    }

    setFloatingNumbers((prev) => [...prev, particle])

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(400),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFloatingNumbers((prev) => prev.filter((n) => n.id !== id))
    })
  }, [])

  return { floatingNumbers, spawnNumber }
}
