import { sleep, wakeUp } from '@/services/session'
import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'

interface Options {
  onWakeUp: (data: {
    passiveEarned: number
    passiveSeconds: number
  }) => void
}

export const useAppLifecycle = ({ onWakeUp }: Options) => {
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const isProcessing = useRef(false)
  const onWakeUpRef = useRef(onWakeUp)

  useEffect(() => {
    onWakeUpRef.current = onWakeUp
  }, [onWakeUp])

  useEffect(() => {
    const handleWakeUp = async () => {
      if (isProcessing.current) {
        return
      }
      isProcessing.current = true

      try {
        const data = await wakeUp()

        onWakeUpRef.current({
          passiveEarned: data.passiveEarned,
          passiveSeconds: data.passiveSeconds
        })
      } finally {
        isProcessing.current = false
      }
    }

    handleWakeUp()

    const subscription = AppState.addEventListener('change', async (nextState) => {
      const prevState = appState.current
      appState.current = nextState

      if (
        prevState === 'active' &&
        (nextState === 'background' || nextState === 'inactive')
      ) {
        await sleep()
      }

      if (
        (prevState === 'background' || prevState === 'inactive') &&
        nextState === 'active'
      ) {
        await handleWakeUp()
      }
    })

    return () => subscription.remove()
  }, [])
}
