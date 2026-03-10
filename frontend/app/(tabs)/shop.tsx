import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BuyItemModal } from '@/components/BuyItemModal'
import { useModal } from '@/context/modal-context'
import { useUserContext } from '@/context/user-context'
import { buyItem, ItemData } from '@/services/items'
import { checkAchievements } from '@/services/achievements'
import { useAchievementQueue } from '@/hooks/use-achievement-queue'
import { useShop } from '@/hooks/use-shop'
import { useCallback, useMemo } from 'react'
import { useNotification } from '@/context/notification-context'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { formatNumber } from '@/helpers/formatNumber'

export default function Shop() {
  const {
    data,
    isLoading,
    refreshing,
    refresh,
    sort
  } = useShop()

  const { refetchUser, user, setUser } = useUserContext()
  const { showModal, hideModal } = useModal()
  const { notify } = useNotification()
  const { enqueue } = useAchievementQueue()

  const coins = user?.coins ?? null
  const userItems = user?.items ?? null

  const isInitialLoading = isLoading && !data

  const isOwned = useCallback(
    (ownedItem: ItemData) =>
      userItems?.some((item) => item._id === ownedItem._id) ?? false,
    [userItems]
  )
  const isNotEnoughCoins = useCallback(
    (item: ItemData) => item.price > (coins ?? 0),
    [coins]
  )

  const handleBuy = useCallback(async (item: ItemData) => {
    if (isOwned(item) || isNotEnoughCoins(item)) return

    try {
      const { coins: newCoins } = await buyItem(item._id)

      setUser((prev) => prev ? { ...prev, coins: newCoins } : null)

      hideModal()

      const { newAchievements } = await checkAchievements()

      if (newAchievements.length > 0) {
        setTimeout(() => enqueue(newAchievements), 350)
      }

      await refetchUser()
    } catch (err) {
      notify('error', getErrorMessage(err))
    }
  }, [isOwned, isNotEnoughCoins, coins, setUser, hideModal, enqueue, refetchUser])

  const openBuyModal = useCallback(
    (item: ItemData) => {
      showModal(
        <BuyItemModal
          item={item}
          onConfirm={() => handleBuy(item)}
          owned={isOwned(item)}
          notEnoughCoins={isNotEnoughCoins(item)}
          onCancel={hideModal}
        />
      )
    },
    [showModal, hideModal, handleBuy, isOwned, isNotEnoughCoins]
  )

  const sortedData = useMemo(() => {
    if (!data) return []

    return sort(data).sort((a, b) => {
      const aOwned = isOwned(a) ? 1 : 0
      const bOwned = isOwned(b) ? 1 : 0

      return aOwned - bOwned
    })
  }, [data, isOwned])

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Шапка */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Магазин</Text>
            <Text style={styles.headerSubtitle}>{data?.length || 0} товаров</Text>
          </View>

          {/* Баланс */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Баланс</Text>
            {isInitialLoading ? (
              <Text style={styles.balanceLoading}>...</Text>
            ) : coins !== null ? (
              <Text style={styles.balanceAmount}>🪙 {formatNumber(coins)}</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#7C3AED"
            colors={['#7C3AED']}
          />
        }
      >
        {!isInitialLoading && sortedData?.map((item) => {
          const owned = isOwned(item)

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              activeOpacity={owned ? 1 : 0.8}
              onPress={() => openBuyModal(item)}
            >
              <View style={[styles.imagePlaceholder, { backgroundColor: item.color }]} />

              <View style={styles.cardBody}>
                <Text style={[styles.itemName, owned && styles.textDisabled]} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.price, owned && styles.textDisabled]}>
                    🪙 {formatNumber(item.price)}
                  </Text>

                  {owned ? (
                    <View style={[styles.addButton, styles.addButtonDisabled]}>
                      <Text style={styles.addButtonText}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.addButton}>
                      <Text style={styles.addButtonText}>+</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 12,
    paddingTop: 24,
  },

  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  circleTopLeft: {
    width: 280,
    height: 280,
    backgroundColor: '#C4B5FD',
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    width: 220,
    height: 220,
    backgroundColor: '#FBCFE8',
    bottom: -60,
    right: -60,
  },

  // Шапка
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTop: {
    width: '100%',
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
    justifyContent: 'center',
    width: 130,
    borderWidth: 1,
    borderColor: '#E0D0FF',
  },
  balanceLabel: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9B6FD4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: '600',
  },
  balanceAmount: {
    textAlign: 'center',
    width: '100%',
    fontSize: 18,
    fontWeight: '700',
    flexWrap: 'nowrap',
    color: '#6A35C2',
  },
  balanceLoading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#B39DDB',
  },
  balanceError: {
    textAlign: 'center',
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
  cardBody: {
    justifyContent: 'space-between',
    padding: 12,
    height: 110
  },
  itemName: {
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
    width: '75%',
    fontSize: 15,
    fontWeight: '700',
    color: '#2D7BF5',
  },
  addButton: {
    width: '25%',
    height: 24,
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
  textDisabled: {
    color: '#999',
  },
  addButtonDisabled: {
    backgroundColor: '#A0A0A0',
  }
})
