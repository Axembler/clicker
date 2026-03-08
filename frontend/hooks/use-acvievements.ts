import { useState, useCallback, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Achievement, AchievementsResponse } from '@/types/achievements'
import { getAchievements } from '@/services/achievements'
import { useNotification } from '@/context/notification-context'
import { getErrorMessage } from '@/utils/getErrorMessage'

const sortAchievements = (achievements: Achievement[] | undefined): Achievement[] =>
  [...(achievements ?? [])].sort((a, b) => {
    const fieldComparison = a.condition.field.localeCompare(b.condition.field)

    if (fieldComparison !== 0) return fieldComparison
    
    return a.condition.value - b.condition.value
  })

interface AchievementsState {
  data: AchievementsResponse | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
}

const INITIAL_STATE: AchievementsState = {
  data: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
}

export function useAchievements() {
  const { notify } = useNotification()

  const [state, setState] = useState<AchievementsState>(INITIAL_STATE)

  const fetchAchievements = useCallback(async (silent = false) => {
    setState(prev => ({
      ...prev,
      error: null,
      ...(silent
        ? { isRefreshing: true }
        : { isLoading: true }
      ),
    }))

    try {
      const data = await getAchievements()

      setState({
        data,
        isLoading: false,
        isRefreshing: false,
        error: null,
      })
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: 'Не удалось загрузить достижения',
      }))
    }
  }, [])

  const onRefresh = useCallback(() => {
    fetchAchievements(true)
  }, [fetchAchievements])

  useEffect(() => {
    if (state.error) notify('error', getErrorMessage(state.error))
  }, [state.error, notify])

  useFocusEffect(
    useCallback(() => {
      fetchAchievements()
    }, [fetchAchievements])
  )

  return {
    ...state,
    sort: sortAchievements,
    onRefresh,
  }
}
