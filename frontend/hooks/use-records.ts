import { getRecords, getUserRecord } from "@/services/records"
import { useCallback, useEffect, useState } from "react"

type SortField = 'clicks' | 'totalCoins'

type RecordsData = {
  rank:       number
  id:         string
  username:   string
  clicks:     number
  totalCoins: number
}

type UserRecordData = {
  rank: number
  user: {
    username:   string
    clicks:     number
    totalCoins: number
  }
}

export function useRecords() {
  const [records, setRecords] = useState<RecordsData[]>([])
  const [myRank, setMyRank] = useState<UserRecordData | null>(null)
  const [sortField, setSortField]  = useState<SortField>('clicks')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true)
      setError(null)

      const [recordsData, userRecordData] = await Promise.all([
        getRecords(),
        getUserRecord(),
      ])

      if (!recordsData.success) {
        throw new Error(recordsData.message ?? 'Ошибка сервера')
      }

      setRecords(recordsData.records)

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
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => fetchData(true), [fetchData])

  const sortedRecords = [...records].sort((a, b) =>
    b[sortField] - a[sortField]
  ).map((item, index) => ({ ...item, rank: index + 1 }))

  return {
    records: sortedRecords,
    myRank,
    sortField,
    setSortField,
    loading,
    refreshing,
    error,
    refresh
  }
}