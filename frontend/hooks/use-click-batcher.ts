import { useRef, useCallback, useEffect } from 'react'

const SYNC_DELAY = 2000
const MAX_PENDING = 50

type OnSyncFn = (clicks: number) => Promise<void>

export function useClickBatcher(onSync: OnSyncFn) {
  const pendingClicks = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSyncRef = useRef<OnSyncFn>(onSync)

  useEffect(() => {
    onSyncRef.current = onSync
  })

  const flush = useCallback(async () => {
    if (pendingClicks.current === 0) return

    const clicksToSend = pendingClicks.current
    pendingClicks.current = 0

    try {
      await onSyncRef.current(clicksToSend)
    } catch (error) {
      pendingClicks.current += clicksToSend
      console.error('Sync failed:', error)
    }
  }, [])

  const registerClick = useCallback(() => {
    pendingClicks.current += 1

    if (pendingClicks.current >= MAX_PENDING) {
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
