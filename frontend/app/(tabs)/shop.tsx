import { useUserContext } from '@/context/user-context'
import { buyItem, getItems, ItemData } from '@/services/items'
import { UserItems } from '@/services/user'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TabTwoScreen() {
  const [coins, setCoins] = useState<number | null>(null)
  const [items, setItems] = useState<ItemData[] | null>(null)
  const [userItems, setUserItems] = useState<UserItems | null>(null)
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null)
  const { refetchUser, isLoading, user } = useUserContext()

  const handlePress = (item: ItemData) => {
    setSelectedItem(item)
  }

  const handleBuy = async (itemId: string | undefined) => {
    try {
      await buyItem(itemId)

      await refetchUser()
    } catch (error) {
      console.error(error)
    } finally {
      setSelectedItem(null)
    }
  }

  const isOwned = (product: ItemData) => userItems?.some((item) => item._id === product._id) ?? false

  useEffect(() => {
    if (user) {
      setCoins(user.coins)
      setUserItems(user.items)
    }
  }, [user])

  const fetchItems = useCallback(async () => {
    try {
      const fetchedItems = await getItems()

      setItems(fetchedItems)
    } catch (error) {
      console.error('Ошибка загрузки предметов:', error)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchItems()
    }, [])
  )

  return (
    <View style={styles.container}>

      {/* Шапка */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Магазин</Text>
            <Text style={styles.headerSubtitle}>{items?.length || 0} товаров</Text>
          </View>

          {/* Баланс */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Баланс</Text>
            {isLoading ? (
              <Text style={styles.balanceLoading}>...</Text>
            ) : coins !== null ? (
              <Text style={styles.balanceAmount}>🪙 {coins}</Text>
            ) : (
              <Text style={styles.balanceError}>—</Text>
            )}
          </View>
        </View>
      </View>

      {/* Список карточек */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {!isLoading && items?.map((product) => {
          const owned = isOwned(product)

          return (
            <TouchableOpacity
              key={product._id}
              style={[styles.card, owned && styles.cardDisabled]}
              onPress={() => !owned && handlePress(product)}
              activeOpacity={owned ? 1 : 0.8}
              // Полностью блокирует все touch-события
              disabled={owned}
            >
              {/* Изображение */}
              <View style={[styles.imagePlaceholder, { backgroundColor: product.color }]}>
                {/* Оверлей поверх картинки */}
                {owned && <View style={styles.ownedOverlay} />}
              </View>

              {/* Информация */}
              <View style={styles.cardBody}>
                <Text style={[styles.productName, owned && styles.textDisabled]} numberOfLines={2}>
                  {product.name}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={[styles.price, owned && styles.textDisabled]}>
                    🪙 {product.price}
                  </Text>
                  {owned ? (
                    <View style={[styles.addButton, styles.addButtonDisabled]}>
                      <Text style={styles.addButtonText}>✓</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handlePress(product)}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Модальное окно */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        {/* Затемненный фон — закрывает модалку по тапу */}
        <Pressable style={styles.overlay} onPress={() => setSelectedItem(null)}>
          {/* Сама карточка — тап внутри не закрывает */}
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>

            {/* Цветная шапка */}
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: selectedItem?.color ?? '#ccc' },
              ]}
            />

            {/* Контент */}
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>

              <Text style={styles.modalDescription}>
                {selectedItem?.description ?? 'Описание отсутствует.'}
              </Text>

              <View style={styles.modalFooter}>
                <Text style={styles.modalPrice}>🪙 {selectedItem?.price}</Text>

                <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(selectedItem?._id)}>
                  <Text style={styles.buyButtonText}>Купить</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Кнопка закрытия */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedItem(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Шапка
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },

  // Баланс
  balanceCard: {
    backgroundColor: '#F5F0FF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#E0D0FF',
  },
  balanceLabel: {
    fontSize: 11,
    color: '#9B6FD4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6A35C2',
  },
  balanceLoading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B39DDB',
  },
  balanceError: {
    fontSize: 18,
    fontWeight: '700',
    color: '#CCC',
  },

  // Сетка
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },

  // Карточка
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 52,
  },
  cardBody: {
    padding: 12,
  },
  category: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D7BF5',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2D7BF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '600',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  ownedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  textDisabled: {
    color: '#999',
  },
  addButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  // Модалка
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    height: 120,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D7BF5',
  },
  buyButton: {
    backgroundColor: '#2D7BF5',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  }
})
