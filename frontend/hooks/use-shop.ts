import { useNotification } from "@/context/notification-context"
import { getShopItems } from "@/services/items"
import { ShopItemData } from "@/types/shop"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"

function sortByPrice(arr: ShopItemData[]): ShopItemData[] {
  return [...arr].sort((a, b) => a.price - b.price)
}

export function useShop() {
  const { notify } = useNotification()

  const [data, setData] = useState<ShopItemData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setIsLoading(true)
      setError(null)

      const fetchedItems = await getShopItems()

      setData(fetchedItems)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка'

      setError(message)

      console.error('Ошибка загрузки предметов:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (error) notify('error', getErrorMessage(error))
  }, [error, notify])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const refresh = useCallback(() => fetchData(), [fetchData])

  return {
    data,
    isLoading,
    refreshing,
    error,
    refresh,
    sort: sortByPrice
  }
}