import { formatNumber } from '@/helpers/formatNumber'
import { useRecords } from '@/hooks/use-records'
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'

interface RecordData {
  id: string
  username: string
  clicks: number
  totalCoins: number
}

type MyRank = {
  rank: number
  user: {
    username: string
    clicks: number
    totalCoins: number
  }
}

const MEDALS: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' }

const TableHeader = () => {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.colRank]}>#</Text>
      <Text style={[styles.headerCell, styles.colUser]}>Username</Text>
      <Text style={[styles.headerCell, styles.colStat]}>👆 Clicks</Text>
      <Text style={[styles.headerCell, styles.colStat]}>🪙 Coins</Text>
    </View>
  )
}

const TableRow = ({
  item,
  index,
}: {
  item: RecordData;
  index: number;
}) => {
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
          {formatNumber(item.clicks)}
        </Text>
      </View>

      <View style={styles.colStat}>
        <Text style={[styles.statValueCell, isTop3 && styles.statValueCellTop3]}>
          {formatNumber(item.totalCoins)}
        </Text>
      </View>
    </View>
  )
}

const MyRankCard = ({ myRank }: { myRank: MyRank }) => (
  <View style={styles.myRankCard}>
    <View style={styles.myRankLeft}>
      <Text style={styles.myRankBadge}>#{myRank.rank}</Text>
      <View>
        <Text style={styles.myRankTitle}>Твой ранг</Text>
        <Text style={styles.myRankUsername} numberOfLines={1}>
          {myRank.user.username}
        </Text>
      </View>
    </View>
    <View style={styles.myRankStats}>
      <View style={styles.myRankStat}>
        <Text style={styles.myRankStatEmoji}>👆</Text>
        <Text style={styles.myRankStatValue}>
          {formatNumber(myRank.user.clicks)}
        </Text>
      </View>
      <View style={styles.myRankDivider} />
      <View style={styles.myRankStat}>
        <Text style={styles.myRankStatEmoji}>🪙</Text>
        <Text style={styles.myRankStatValue}>
          {formatNumber(myRank.user.totalCoins)}
        </Text>
      </View>
    </View>
  </View>
)

const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={styles.errorBanner}>
    <Text style={styles.errorText}>{message}</Text>

    <TouchableOpacity onPress={onRetry} style={styles.retryBtn} activeOpacity={0.75}>
      <Text style={styles.retryBtnText}>Retry</Text>
    </TouchableOpacity>
  </View>
)

export default function RecordsScreen() {
  const {
    records,
    myRank,
    loading,
    refreshing,
    error,
    refresh,
  } = useRecords()

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Загрузка рекордов...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      <View style={styles.header}>
        <Text style={styles.title}>🏆 Рекорды</Text>
        <Text style={styles.subtitle}>Лучшие игроки</Text>
      </View>

      {error && <ErrorBanner message={error} onRetry={refresh} />}

      <View style={styles.tableCard}>
        <TableHeader />

        <View style={styles.tableDivider} />

        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TableRow item={item} index={index} />
          )}
          ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
          showsVerticalScrollIndicator={false}
          scrollEnabled={records.length > 6}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#7C3AED"
              colors={['#7C3AED']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Пусто</Text>
            </View>
          }
        />
      </View>

      {myRank && <MyRankCard myRank={myRank} />}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>👥</Text>
          <Text style={styles.statValue}>{records.length}</Text>
          <Text style={styles.statLabel}>Players</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>👆</Text>
          <Text style={styles.statValue}>
            {formatNumber(records.reduce((s, r) => s + r.clicks, 0))}
          </Text>
          <Text style={styles.statLabel}>Всего кликов</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🪙</Text>
          <Text style={styles.statValue}>
            {formatNumber(records.reduce((s, r) => s + r.totalCoins, 0))}
          </Text>
          <Text style={styles.statLabel}>Всего монет</Text>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    gap: 12,
  },
  loadingText: {
    color: '#A78BFA',
    fontSize: 16,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  
  header: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },

  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  circleTopLeft: {
    width: 280,
    height: 280,
    backgroundColor: '#C4B5FD',
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    width: 220,
    height: 220,
    backgroundColor: '#FBCFE8',
    bottom: -60,
    right: -60,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4C1D95',
    marginBottom: 6,
    marginTop: 18,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#A78BFA',
    marginBottom: 16,
  },

  errorBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  tableCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    maxHeight: 380,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 2
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerCellActive: {
    color: '#7C3AED',
  },
  tableDivider: {
    height: 1,
    backgroundColor: '#EDE9FE',
    marginBottom: 8,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: '#F5F3FF',
    marginVertical: 2,
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

  medal: {
    fontSize: 20,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C4B5FD',
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

  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#C4B5FD',
    fontWeight: '600',
  },

  myRankCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  myRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myRankBadge: {
    fontSize: 26,
    fontWeight: '900',
    color: '#EDE9FE',
    letterSpacing: -0.5,
  },
  myRankTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  myRankUsername: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    maxWidth: 140,
  },
  myRankStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myRankStat: {
    alignItems: 'center',
    gap: 2,
  },
  myRankStatEmoji: {
    fontSize: 16,
  },
  myRankStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  myRankDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#A78BFA',
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 32,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 16,
  },
  statCard: {
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5B21B6',
  },
  statLabel: {
    fontSize: 10,
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EDE9FE',
  }
})
