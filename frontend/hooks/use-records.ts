import { useNotification } from "@/context/notification-context"
import { getRecords, getUserRecord } from "@/services/records"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"

type SortField = 'totalClicks' | 'totalCoins'

type RecordsData = {
  rank: number
  id: string
  username: string
  totalClicks: number
  totalCoins: number
}

type UserRecordData = {
  rank: number
  user: {
    username: string
    totalClicks: number
    totalCoins: number
  }
}

export function useRecords() {
  const { notify } = useNotification()
  
  const [data, setData] = useState<RecordsData[]>([])
  const [myRank, setMyRank] = useState<UserRecordData | null>(null)
  const [sortField, setSortField]  = useState<SortField>('totalClicks')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setIsLoading(true)
      setError(null)

      const [recordsData, userRecordData] = await Promise.all([
        getRecords(),
        getUserRecord()
      ])

      if (!recordsData.success) {
        throw new Error(recordsData.message ?? 'Ошибка сервера')
      }

      setData(recordsData.records)

      if (userRecordData.success) {
        setMyRank({
          rank: userRecordData.rank,
          user: userRecordData.user,
        })
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'

      setError(message)

      console.error('Error:', err)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  useEffect(() => {
    if (error) notify('error', getErrorMessage(error))
  }, [error, notify])

  const refresh = useCallback(() => fetchData(true), [fetchData])

  const sortedRecords = [...data].sort((a, b) =>
    b[sortField] - a[sortField]
  ).map((item, index) => ({ ...item, rank: index + 1 }))

  return {
    data: sortedRecords,
    myRank,
    sortField,
    setSortField,
    isLoading,
    refreshing,
    error,
    refresh
  }
}