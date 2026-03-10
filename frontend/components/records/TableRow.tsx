import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { formatNumber } from "@/helpers/formatNumber"

export interface RecordData {
  id: string
  username: string
  totalClicks: number
  totalCoins: number
}

const MEDALS: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' }

export const TableRow = memo(({ item, index, }: { item: RecordData; index: number }) => {
  const isTop3 = index < 3

  return (
    <View style={[styles.tableRow, isTop3 && styles.tableRowTop3]}>
      <View style={styles.colRank}>
        {isTop3 ? (
          <Text style={styles.medal}>{MEDALS[index]}</Text>
        ) : (
          <Text style={styles.rankText}>{index + 1}</Text>
        )}
      </View>

      <View style={styles.colUser}>
        <Text style={[styles.usernameText, isTop3 && styles.usernameTextTop3]} numberOfLines={1}>
          {item.username}
        </Text>
      </View>

      <View style={styles.colStat}>
        <Text style={[styles.statValueCell, isTop3 && styles.statValueCellTop3]}>
          {formatNumber(item.totalClicks)}
        </Text>
      </View>

      <View style={styles.colStat}>
        <Text style={[styles.statValueCell, isTop3 && styles.statValueCellTop3]}>
          {formatNumber(item.totalCoins)}
        </Text>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  colRank: {
    width: 36,
    alignItems: 'center',
  },
  colUser: {
    flex: 1,
    paddingHorizontal: 6,
  },
  colStat: {
    width: 72,
    alignItems: 'flex-end',
  },
  medal: {
    fontSize: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tableRowTop3: {
    backgroundColor: '#F5F3FF',
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D28D9',
  },
  usernameTextTop3: {
    fontWeight: '800',
    color: '#4C1D95',
  },
  statValueCell: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  statValueCellTop3: {
    color: '#4C1D95',
    fontWeight: '800',
  },
  statValueCellHighlight: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C4B5FD',
  },
})