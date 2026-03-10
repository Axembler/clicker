import { apiClient } from "@/utils/apiClient"
import * as SecureStore from 'expo-secure-store'

export interface UserData {
  id: string
  username: string
  coins: number
  totalCoins: number
  clicks: number
  clickPower: number
  passiveIncome: number
  items: string[]
  passiveEarned: number
  passiveSeconds: number
  prestige: number
}

export interface UserItem {
  _id: string
  name: string
}

export type UserItems = UserItem[]

export interface PrestigeResponse {
  message: string
  coins: number
  clicks: number
  prestige: number
}


export const getUser = async (): Promise<any> => {
  const response = await apiClient('/user', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения данных о пользователе')
  }

  const data = await response.json()

  return data
}

export const getUserItems = async (): Promise<UserItems> => {
  const response = await apiClient('/user/items', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения предметов пользователя')
  }

  const data = await response.json()

  return data
}

export const prestige = async (): Promise<PrestigeResponse> => {
  const response = await apiClient('/user/prestige', {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.message)

  return data
}

export const wakeUp = async (): Promise<UserData> => {
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

export const sleep = async (): Promise<void> => {
  const sleepAt = Date.now()

  await SecureStore.setItemAsync('lastSleepAt', String(sleepAt))

  try {
    await apiClient('/user/sleep', {
      method: 'POST',
      body: JSON.stringify({ sleepAt })
    })
  } catch {
  }
}
