import { UserData } from "./user"

export interface Item {
  _id: string
  name: string
  description: string
  passiveIncomeBonus: number
  price: number
  sortOrder: number
  color: string
}

export interface UserItem {
  _id: string
  user: Pick<UserData, '_id' | 'username' | 'skillPoints'>
  item: Pick<Item,
    '_id' |
    'name' |
    'description' |
    'passiveIncomeBonus' |
    'price'|
    'sortOrder'|
    'color'
  >
  nodeId: string
  level: number
}

export interface BuyItemResponse {
  message: string
  coins: number
  item: UserItem
}