import React, { useEffect, useRef } from 'react'
import { Animated, ScrollView, StyleSheet, View } from 'react-native'

const SKELETON_COUNT = 6

function SkeletonCard() {
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  })

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.imagePlaceholder, { opacity }]} />

      <View style={styles.cardBody}>
        <Animated.View style={[styles.nameLine, { opacity }]} />
        <Animated.View style={[styles.nameLineShort, { opacity }]} />

        <View style={styles.cardFooter}>
          <Animated.View style={[styles.pricePlaceholder, { opacity }]} />
          <Animated.View style={[styles.buttonPlaceholder, { opacity }]} />
        </View>
      </View>
    </View>
  )
}

export default function ShopSkeleton() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  imagePlaceholder: {
    width: '100%',
    height: 130,
    backgroundColor: '#E0DCEA',
  },

  cardBody: {
    padding: 12,
    height: 110,
    justifyContent: 'space-between',
  },

  nameLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0DCEA',
    marginBottom: 6,
    width: '90%',
  },
  nameLineShort: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0DCEA',
    width: '60%',
    marginBottom: 10,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricePlaceholder: {
    height: 14,
    borderRadius: 6,
    backgroundColor: '#E0DCEA',
    width: '55%',
  },
  buttonPlaceholder: {
    width: '25%',
    height: 24,
    borderRadius: 15,
    backgroundColor: '#E0DCEA',
  },
})
