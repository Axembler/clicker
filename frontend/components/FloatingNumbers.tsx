import { formatNumber } from '@/helpers/formatNumber'
import React, { memo, useMemo } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'

interface FloatingNumber {
  id: number
  x: number
  y: number
  translateY: Animated.Value
  opacity: Animated.Value
  scale: Animated.Value
  label: string
}

interface Props {
  numbers: FloatingNumber[]
}

interface ItemProps {
  item: FloatingNumber
}

const COLOR_THRESHOLDS: [number, string][] = [
  [25, '#ec5c8f'],
  [15, '#6ab6f0'],
  [10, '#e36161'],
  [5,  '#e08d28'],
  [3,  '#c462ea'],
  [1,  '#d4a162'],
]

const DEFAULT_COLOR = '#FFD700'

const getColor = (value: number): string => {
  for (const [threshold, color] of COLOR_THRESHOLDS) {
    if (value >= threshold) return color
  }
  return DEFAULT_COLOR
}

const FloatingNumberItem = memo(({ item }: ItemProps) => {
  const value = useMemo(
    () => parseInt(item.label.replace('+', ''), 10),
    [item.label]
  )

  const color = useMemo(() => getColor(value), [value])
  const formatted = useMemo(() => formatNumber(value), [value])

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: item.x,
          top: item.y,
          opacity: item.opacity,
          transform: [
            { translateY: item.translateY },
            { scale: item.scale },
          ],
        },
      ]}
    >
      <Text style={[styles.text, { color }]}>
        {formatted}
      </Text>
    </Animated.View>
  )
})

export const FloatingNumbers = memo(({ numbers }: Props) => {
  if (!numbers.length) return null

  return (
    <>
      {numbers.map((item) => (
        <FloatingNumberItem key={item.id} item={item} />
      ))}
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
})
