import { Timestamps } from '@/types/counter'
import { useRef, useCallback, useEffect } from 'react'

const SYNC_DELAY = 2000
const MAX_PENDING = 50

type OnSyncFn = (timestamps: Timestamps) => Promise<void>

export function useClickBatcher(onSync: OnSyncFn) {
  const pendingTimestamps = useRef<number[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSyncRef = useRef<OnSyncFn>(onSync)

  useEffect(() => {
    onSyncRef.current = onSync
  })

  const flush = useCallback(async () => {
    if (pendingTimestamps.current.length === 0) return

    const timestampsToSend = pendingTimestamps.current

    pendingTimestamps.current = []

    await onSyncRef.current(timestampsToSend)
  }, [])

  const registerClick = useCallback(() => {
    const timestamp = Date.now()

    pendingTimestamps.current.push(timestamp)

    if (pendingTimestamps.current.length >= MAX_PENDING) {
      clearTimeout(timerRef.current ?? undefined)

      flush()

      return
    }

    clearTimeout(timerRef.current ?? undefined)

    timerRef.current = setTimeout(flush, SYNC_DELAY)
  }, [flush])

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current ?? undefined)

      flush()
    }
  }, [flush])

  return { registerClick }
}
