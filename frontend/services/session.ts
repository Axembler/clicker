import * as SecureStore from 'expo-secure-store'
import { apiClient } from "@/utils/apiClient"
import { withHealthCheck } from "@/utils/withHealthCheck"
import { SessionData } from "@/types/session"

const _wakeUp = async (): Promise<SessionData> => {
  const localSleepAt = await SecureStore.getItemAsync('lastSleepAt')

  const response = await apiClient('/session/wakeup', {
    method: 'POST',
    body: JSON.stringify({
      fallbackSleepAt: localSleepAt ? Number(localSleepAt) : null
    })
  })
  
  if (!response.ok) throw new Error('Ошибка wakeup')

  await SecureStore.deleteItemAsync('lastSleepAt')

  const data = await response.json()

  return data
}

export const sleep = async (): Promise<void> => {
  const sleepAt = Date.now()

  await SecureStore.setItemAsync('lastSleepAt', String(sleepAt))

  const response = await apiClient('/session/sleep', {
    method: 'POST',
    body: JSON.stringify({ fallbackSleepAt: sleepAt })
  })

  if (!response.ok) {
    console.warn('sleep: сервер не ответил')
  }
}

export const wakeUp = withHealthCheck(_wakeUp)