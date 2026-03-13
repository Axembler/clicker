import { useNotification } from "@/context/notification-context"
import { getShopItems } from "@/services/items"
import { ShopItemData } from "@/types/shop"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useFocusEffect } from "expo-router"
import { useCallback, useMemo, useState } from "react"

function sortShop(data: ShopItemData[]): ShopItemData[] {
  return [...data].sort((a, b) => a.price - b.price)
}

export function useShop() {
  const { notify } = useNotification()

  const [data, setData] = useState<ShopItemData[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    try {
      const fetchedItems = await getShopItems()

      setData(fetchedItems)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'

      notify('error', getErrorMessage(message))
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  const sortedShop = useMemo(
    () => (data ? sortShop(data) : null),
    [data]
  )

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  return {
    data: sortedShop,
    isLoading: isLoading
  }
}
