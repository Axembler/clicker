import { memo } from "react"
import { StyleSheet, View } from "react-native"

export const Connector = memo(({ color }: { color: string }) => {
  return (
    <View style={styles.connectorWrapper}>
      <View style={[styles.connectorLine, { backgroundColor: color + '40' }]} />
      <View style={[styles.connectorDot, { backgroundColor: color + '80' }]} />
      <View style={[styles.connectorLine, { backgroundColor: color + '40' }]} />
    </View>
  )
})

const styles = StyleSheet.create({
  connectorWrapper: {
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 38,
    gap: 0,
    height: 36,
    justifyContent: 'center',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    borderRadius: 1,
  },
  connectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
})