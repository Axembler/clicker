import { getUserStats } from "@/services/stats"
import { Stats } from "@/types/stats"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

export function useStats() {
  const [stats, setStats] = useState<Stats>()

  const fetchData = useCallback(async () => {
    try {
      const data = await getUserStats()

      setStats(data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  return {
    stats,
    refetchData: fetchData
  }
}