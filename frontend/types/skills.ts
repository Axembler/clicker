import { UserData } from "./user"

export type SkillLevels = Record<string, number>

export type SkillNodeStatus = 'locked' | 'available' | 'partial' | 'maxed'

export interface SkillNode {
  id: string
  emoji: string
  name: string
  desc: string
  maxLevel: number
  cost: number
  requires?: string
}

export interface Skill {
  _id: string
  id: string
  label: string
  emoji: string
  color: string
  bgColor: string
  nodes: SkillNode[]
}

export interface UserSkill {
  _id: string
  user: Pick<UserData, '_id' | 'username' | 'skillPoints'>
  skill: Pick<Skill, 'id' | 'label' | 'emoji' | 'color' | 'bgColor'>
  nodeId: string
  level: number
}

export interface BuySkillResponse {
  message: string
  userSkill: UserSkill
  skillPoints: number
}