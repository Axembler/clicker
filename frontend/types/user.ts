export interface UserItem {
  _id: string
  name: string
}

export interface UserData {
  id: string
  username: string
  coins: number
  totalCoins: number
  clicks: number
  clickPower: number
  passiveIncome: number
  items: UserItem[]
  passiveEarned: number
  passiveSeconds: number
  prestige: number
}

export interface PrestigeResponse {
  message: string
  coins: number
  clicks: number
  prestige: number
}