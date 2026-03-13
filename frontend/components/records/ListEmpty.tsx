import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"

export const ListEmpty = memo(() => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Пусто</Text>
  </View>
))

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#C4B5FD',
    fontWeight: '600',
  }
})