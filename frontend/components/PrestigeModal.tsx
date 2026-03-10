import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface PrestigeModalProps {
  prestige?: number
  onConfirm: () => void
  onCancel: () => void
}

export function PrestigeModal({ prestige = 0, onConfirm, onCancel }: PrestigeModalProps) {
  return (
    <View style={styles.container}>

      <View style={styles.iconBadge}>
        <Text style={styles.iconText}>🏆</Text>
      </View>

      <Text style={styles.title}>Поздравляем!</Text>
      <Text style={styles.subtitle}>
        Ты открыл все достижения{prestige > 0 ? (` ×${prestige}`) : ''} 🎉
      </Text>

      <View style={styles.prestigeCard}>
        <Text style={styles.prestigeCardTitle}>⭐ Престиж</Text>
        <Text style={styles.prestigeCardText}>
          Сбрось достижения и начни путь заново — твой прогресс будет отмечен
          особым знаком престижа.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Не сейчас</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.85}>
          <Text style={styles.confirmText}>Престиж!</Text>
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

  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  iconText: {
    fontSize: 34,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4C1D95',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#A78BFA',
    marginBottom: 4,
  },

  prestigeCard: {
    width: '100%',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  prestigeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4C1D95',
  },
  prestigeCardText: {
    fontSize: 13,
    color: '#6D28D9',
    lineHeight: 19,
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
    justifyContent: 'center',
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
    justifyContent: 'center',
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
