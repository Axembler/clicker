import { useNotification } from "@/context/notification-context"
import { getUserAchievements } from "@/services/achievements"
import { UserAchievement } from "@/types/achievements"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

export function useUserAchievements() {
  const { notify } = useNotification()

  const [userAchievements, setUserAchievements] = useState<UserAchievement[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchUserAchievements = useCallback(async () => {
    setIsLoading(true)

    try {
      const fetchedUserAchievements = await getUserAchievements()

      setUserAchievements(fetchedUserAchievements)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'

      notify('error', getErrorMessage(message))
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  useFocusEffect(
    useCallback(() => {
      fetchUserAchievements()
    }, [fetchUserAchievements])
  )

  return {
    userAchievements,
    refetchUserAchievements: fetchUserAchievements,
    isLoading
  }
}
