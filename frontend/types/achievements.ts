export type AchievementConditionField =
  | 'clicks'
  | 'coins'
  | 'totalCoins'
  | 'clickPower'
  | 'passiveIncome'
  | 'items'

export type AchievementConditionOperator = 'gte' | 'lte' | 'eq' | 'length_gte'

export interface AchievementCondition {
  field: AchievementConditionField
  operator: AchievementConditionOperator
  value: number
}

export interface AchievementReward {
  coins: number
}

export interface Achievement {
  _id: string
  title: string | null
  description: string
  condition: AchievementCondition
  reward: AchievementReward
  createdAt: string
  updatedAt: string
  unlocked: boolean
  unlockedAt: string | null
}

export interface AchievementsResponse {
  success: boolean
  total: number
  unlocked: number
  achievements: Achievement[]
}

export interface CheckedAchievement {
  _id: string
  title: string | null
  description: string
  reward: AchievementReward
}

export interface CheckAchievementsResponse {
  success: boolean
  newAchievements: CheckedAchievement[]
  hasNew: boolean
}
