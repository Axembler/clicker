import { memo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const ErrorBanner = memo(({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={styles.errorBanner}>
    <Text style={styles.errorText}>{message}</Text>

    <TouchableOpacity onPress={onRetry} style={styles.retryBtn} activeOpacity={0.75}>
      <Text style={styles.retryBtnText}>Retry</Text>
    </TouchableOpacity>
  </View>
))

const styles = StyleSheet.create({
    errorBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
})