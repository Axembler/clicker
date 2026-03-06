import { sleep, wakeUp } from '@/services/user';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface Options {
  onWakeUp: (data: { passiveEarned: number; passiveSeconds: number; coins: number }) => void
}

export const useAppLifecycle = ({ onWakeUp }: Options) => {
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const isProcessing = useRef(false)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (
        appState.current === 'active' &&
        (nextState === 'background' || nextState === 'inactive')
      ) {
        await sleep()
      }

      if (
        (appState.current === 'background' || appState.current === 'inactive') &&
        nextState === 'active' &&
        !isProcessing.current
      ) {
        isProcessing.current = true
        try {
          const data = await wakeUp()
          onWakeUp({
            passiveEarned: data.passiveEarned,
            passiveSeconds: data.passiveSeconds,
            coins: data.coins,
          })
        } finally {
          isProcessing.current = false
        }
      }

      appState.current = nextState
    })

    return () => subscription.remove()
  }, [onWakeUp])
}
