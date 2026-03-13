export type SortField = 'totalClicks' | 'totalCoins'

export interface RecordEntry {
  rank: number
  id: string
  username: string
  totalClicks: number
  totalCoins: number
}

export interface RecordsData {
  success:  boolean
  sortedBy: SortField
  total: number
  records:  RecordEntry[]
  message?: string
}

export interface UserRecordData {
  success: boolean
  rank: number
  user: {
    username: string
    totalClicks: number
    totalCoins: number
  }
}