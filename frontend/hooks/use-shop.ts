import { getItems, ItemData } from "@/services/items"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

export function useShop() {
  const [data, setData] = useState<ItemData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setIsLoading(true)
      setError(null)

      const fetchedItems = await getItems()

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
    refresh
  }
}