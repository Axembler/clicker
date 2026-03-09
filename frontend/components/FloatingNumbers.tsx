import React from 'react'
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

const getColor = (label: string) => {
  const value = parseInt(label.replace('+', ''))
  
  if (value >= 25) return '#ec5c8f'
  if (value >= 15) return '#6ab6f0'
  if (value >= 10) return '#e36161'
  if (value >= 5)  return '#e08d28'
  if (value >= 3)  return '#c462ea'
  if (value >= 1)  return '#d4a162'

  return '#FFD700'
}

export function FloatingNumbers({ numbers }: Props) {
  return (
    <>
      {numbers.map((item) => (
        <Animated.View
          key={item.id}
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
          <Text style={[styles.text, { color: getColor(item.label) }]}>
            {item.label}
          </Text>
        </Animated.View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
})
