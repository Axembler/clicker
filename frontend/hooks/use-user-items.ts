import { useCallback, useState } from "react"
import { useFocusEffect } from "expo-router"
import { useNotification } from "@/context/notification-context"
import { getUserItems } from "@/services/items"
import { UserItem } from "@/types/shop"
import { getErrorMessage } from "@/utils/getErrorMessage"

export function useUserItems() {
  const { notify } = useNotification()

  const [data, setData] = useState<UserItem[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    try {
      const fetchedUserItems = await getUserItems()

      setData(fetchedUserItems)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'

      notify('error', getErrorMessage(message))
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  return {
    data,
    refetchData: fetchData,
    isLoading
  }
}
