import { apiClient } from "@/utils/apiClient"
import * as SecureStore from 'expo-secure-store'
import { UserData } from "./user"
import { withHealthCheck } from "@/utils/withHealthCheck"

const _wakeUp = async (): Promise<UserData> => {
  const localSleepAt = await SecureStore.getItemAsync('lastSleepAt')

  const response = await apiClient('/user/wakeup', {
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

const _sleep = async (): Promise<void> => {
  const sleepAt = Date.now()

  await SecureStore.setItemAsync('lastSleepAt', String(sleepAt))

  const response = await apiClient('/user/sleep', {
    method: 'POST',
    body: JSON.stringify({ sleepAt })
  })

  if (!response.ok) {
    console.warn('sleep: сервер не ответил')
  }
}

export const wakeUp = withHealthCheck(_wakeUp)
export const sleep = withHealthCheck(_sleep)