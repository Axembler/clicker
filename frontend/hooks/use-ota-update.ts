import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'

export function useOTAUpdate() {
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function checkAndUpdate() {
      if (__DEV__) return

      try {
        const update = await Updates.checkForUpdateAsync()

        if (!update.isAvailable) return

        setIsUpdating(true)

        await Updates.fetchUpdateAsync()

        await Updates.reloadAsync()
      } catch (error) {
        setIsUpdating(false)
        console.error('OTA update failed:', error)
      }
    }

    checkAndUpdate()
  }, [])

  return { isUpdating }
}
