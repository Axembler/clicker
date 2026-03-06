import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface SignOutModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function SignOutModal({ onConfirm, onCancel }: SignOutModalProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выход</Text>
      <Text style={styles.message}>Ты точно хочешь выйти?</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Отмена</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4C1D95',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    color: '#A78BFA',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
  },
  cancelText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
