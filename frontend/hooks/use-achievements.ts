import { useCallback, useMemo, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Achievement } from '@/types/achievements'
import { getAchievements } from '@/services/achievements'
import { useNotification } from '@/context/notification-context'
import { getErrorMessage } from '@/utils/getErrorMessage'

const sortAchievements = (achievements: Achievement[] | undefined): Achievement[] =>
  [...(achievements ?? [])]
    .sort((a, b) => {
      const byField = a.condition.field.localeCompare(b.condition.field)

      return byField !== 0 ? byField : a.condition.value - b.condition.value
    })

export function useAchievements() {
  const { notify } = useNotification()

  const [data, setData] = useState<Achievement[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchAchievements = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await getAchievements()
      setData(result)
    } catch (error) {
      notify('error', getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  const sortedAchievements = useMemo(
    () => (data ? sortAchievements(data) : null),
    [data]
  )

  useFocusEffect(
    useCallback(() => {
      fetchAchievements()
    }, [fetchAchievements])
  )

  return {
    data: sortedAchievements,
    total: data?.length ?? 0,
    isLoading
  }
}
