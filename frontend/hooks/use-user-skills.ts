import { useNotification } from "@/context/notification-context"
import { getUserSkills } from "@/services/skills"
import { UserSkill } from "@/types/skills"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

export function useUserSkills() {
  const { notify } = useNotification()

  const [data, setData] = useState<UserSkill[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    try {
      const fetchedUserSkills = await getUserSkills()

      setData(fetchedUserSkills)
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
