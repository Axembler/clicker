import { useCallback, useState } from "react"
import { useFocusEffect } from "expo-router"
import { useNotification } from "@/context/notification-context"
import { Skill } from "@/types/skills"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { getSkills } from "@/services/skills"

export function useSkills() {
  const { notify } = useNotification()

  const [data, setData] = useState<Skill[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    try {
      const fetchedSkills = await getSkills()

      setData(fetchedSkills)
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
    isLoading
  }
}
