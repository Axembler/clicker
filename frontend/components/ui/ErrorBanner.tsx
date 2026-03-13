import { memo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Props {
  message?: string
  onSignOut: () => void
  onRetry: () => void
}

export const ErrorBanner = memo(({ message = 'Произошла неизвестная ошибка', onRetry, onSignOut }: Props) => (
  <View style={styles.errorBanner}>
    <Text style={styles.errorText}>{message}</Text>

    <TouchableOpacity onPress={onRetry} style={styles.retryBtn} activeOpacity={0.75}>
      <Text style={styles.retryBtnText}>Повторить</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onSignOut} style={styles.signOutBtn} activeOpacity={0.75}>
      <Text style={styles.signOutBtnText}>Выйти из аккаунта</Text>
    </TouchableOpacity>
  </View>
))

const styles = StyleSheet.create({
  errorBanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d43b3b',
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
  signOutBtn: {
    backgroundColor: '#b644ef',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signOutBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
})