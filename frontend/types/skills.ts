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

export interface Branch {
  id: string
  label: string
  emoji: string
  color: string
  bgColor: string
  nodes: SkillNode[]
}