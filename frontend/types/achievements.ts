import { UserData } from "./user"

type AchievementConditionField =
  | 'clicks'
  | 'coins'
  | 'totalCoins'
  | 'clickPower'
  | 'passiveIncome'
  | 'items'

type AchievementConditionOperator = 'gte' | 'lte' | 'eq' | 'length_gte'

interface AchievementCondition {
  field: AchievementConditionField
  operator: AchievementConditionOperator
  value: number
}

interface AchievementReward {
  coins: number
}

export interface Achievement {
  _id: string
  title: string | null
  description: string
  condition: AchievementCondition
  reward: AchievementReward
}

export interface UserAchievement {
  _id: string
  user: Pick<UserData, '_id' | 'username'>
  achievement: Pick<Achievement,
    '_id' |
    'title' |
    'condition' |
    'reward' |
    'description'
  >
  unlockedAt: string
}
