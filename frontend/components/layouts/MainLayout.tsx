import { View, StyleSheet } from 'react-native'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 12,
    paddingTop: 12,
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
  }
})
