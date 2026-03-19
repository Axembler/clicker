import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'

type OTAStatus = 'checking' | 'updating' | 'idle'

export function useOTAUpdate() {
  const [status, setStatus] = useState<OTAStatus>('checking')

  useEffect(() => {
    async function checkAndUpdate() {
      if (__DEV__) {
        setStatus('idle')

        return
      }

      try {
        const update = await Updates.checkForUpdateAsync()

        if (!update.isAvailable) {
          setStatus('idle')

          return
        }

        setStatus('updating')

        await Updates.fetchUpdateAsync()

        await Updates.reloadAsync()
      } catch (error) {
        setStatus('idle')
      }
    }

    checkAndUpdate()
  }, [])

  return {
    isChecking: status === 'checking',
    isUpdating: status === 'updating',
    isReady:    status === 'idle'
  }
}
