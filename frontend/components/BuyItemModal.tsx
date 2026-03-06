import { ItemData } from '@/services/items'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface BuyItemModalProps {
  item: ItemData,
  owned: boolean,
  onConfirm: (item: ItemData) => void
  onCancel: () => void
}

export function BuyItemModal({ item, onConfirm, onCancel, owned }: BuyItemModalProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: item.color ?? '#7C3AED' }]} />

      <View style={styles.body}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.description}>
          {item.description ?? 'Описание отсутствует'}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.price}>🪙 {item.price}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Отмена</Text>
          </TouchableOpacity>

          {owned ? (
            <View style={[styles.confirmButton, styles.confirmButtonDisabled]}>
              <Text style={styles.confirmText}>Куплено ✓</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>Купить</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  header: {
    width: '100%',
    height: 8,
  },
  body: {
    paddingVertical: 28,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4C1D95',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#A78BFA',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EDE9FE',
    marginVertical: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 4,
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
  confirmButtonDisabled: {
    backgroundColor: '#cec6f0'
  }
})
