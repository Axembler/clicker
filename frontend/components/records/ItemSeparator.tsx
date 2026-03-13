import { memo } from "react"
import { StyleSheet, View } from "react-native"

export const ItemSeparator = memo(() => <View style={styles.rowSeparator} />)

const styles = StyleSheet.create({
  rowSeparator: {
    height: 1,
    backgroundColor: '#F5F3FF',
    marginVertical: 2,
  }
})