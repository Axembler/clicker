import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"

export const TableHeader = memo(() => {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.colRank]}>#</Text>
      <Text style={[styles.headerCell, styles.colUser]}>Username</Text>
      <Text style={[styles.headerCell, styles.colStat]}>👆 Clicks</Text>
      <Text style={[styles.headerCell, styles.colStat]}>🪙 Coins</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 2
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
  headerCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})