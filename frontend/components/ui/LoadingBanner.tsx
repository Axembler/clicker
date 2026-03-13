import { memo } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

export const LoadingBanner = memo(({ message } : { message?: string }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#A78BFA" />

    <Text style={styles.loadingText}>{message ? message : 'Загрузка...'}</Text>
  </View>
))

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    gap: 12
  },
  loadingText: {
    color: '#A78BFA',
    fontSize: 16
  }
})