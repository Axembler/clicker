import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

export function useOTAUpdate() {
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function checkUpdate() {
      if (__DEV__) return

      try {
        const update = await Updates.checkForUpdateAsync()

        if (!update.isAvailable) return

        setIsUpdating(true)

        await Updates.fetchUpdateAsync()

        setIsUpdating(false)

        Alert.alert(
          '🆕 Доступно обновление',
          'Приложение будет перезапущено для применения обновлений',
          [
            {
              text: 'Обновить сейчас',
              onPress: async () => await Updates.reloadAsync(),
            },
            {
              text: 'Позже',
              style: 'cancel',
            },
          ]
        )
      } catch (error) {
        setIsUpdating(false)
        console.error('OTA check failed:', error)
      }
    }

    checkUpdate()
  }, [])

  return { isUpdating }
}
