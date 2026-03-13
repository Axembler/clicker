import { useNotification } from "@/context/notification-context"
import { getRecords, getUserRecord } from "@/services/records"
import { RecordEntry, SortField, UserRecordData } from "@/types/records"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useFocusEffect } from "expo-router"
import { useCallback, useMemo, useState } from "react"

interface RecordsState {
  data: RecordEntry[] | null
  myRank?: UserRecordData
}

function sortRecords(data: RecordEntry[], field: SortField) {
  return [...data]
    .sort((a, b) => b[field] - a[field])
    .map((item, index) => ({ ...item, rank: index + 1 }))
}

export function useRecords() {
  const { notify } = useNotification()

  const [{ data, myRank }, setRecords] = useState<RecordsState>({ data: null })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sortField, setSortField] = useState<SortField>('totalClicks')

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [recordsData, userRecordData] = await Promise.all([
        getRecords(),
        getUserRecord(),
      ])

      if (!recordsData.success) {
        throw new Error(recordsData.message ?? 'Ошибка сервера')
      }

      setRecords({
        data: recordsData.records,
        myRank: userRecordData.success ? userRecordData : undefined,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'

      notify('error', getErrorMessage(message))
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  const sortedRecords = useMemo(
    () => (data ? sortRecords(data, sortField) : null),
    [data, sortField]
  )

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  return {
    data: sortedRecords,
    myRank,
    sortField,
    setSortField,
    isLoading
  }
}
