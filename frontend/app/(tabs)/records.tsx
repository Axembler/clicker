import { MyRankCard, StatsRow, TableHeader, TableRow } from '@/components/records'
import { RecordData } from '@/components/records/TableRow'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { formatNumber } from '@/helpers/formatNumber'
import { useRecords } from '@/hooks/use-records'
import React, { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'

const ItemSeparator = () => <View style={styles.rowSeparator} />

const ListEmpty = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Пусто</Text>
  </View>
)

export default function RecordsScreen() {
  const { data, myRank, isLoading, refreshing, refresh } = useRecords()

  const isInitialLoading = isLoading && !data

  const { totalClicks, totalCoins } = useMemo(
    () =>
      (data ?? []).reduce(
        (acc, r) => ({
          totalClicks: acc.totalClicks + (r.clicks || 0),
          totalCoins: acc.totalCoins + (r.totalCoins || 0),
        }),
        { totalClicks: 0, totalCoins: 0 }
      ),
    [data]
  )

  const renderItem = useCallback(
    ({ item, index }: { item: RecordData; index: number }) => (
      <TableRow item={item} index={index} />
    ), []
  )

  if (isInitialLoading) {
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

      <View style={styles.tableCard}>
        <TableHeader />

        <View style={styles.tableDivider} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          scrollEnabled={data.length > 6}
          ListEmptyComponent={ListEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#7C3AED"
              colors={['#7C3AED']}
            />
          }
        />
      </View>

      {myRank && <MyRankCard myRank={myRank} />}

      <StatsRow
        length={data.length}
        totalClicks={formatNumber(totalClicks)}
        totalCoins={formatNumber(totalCoins)}
      />
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

  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#C4B5FD',
    fontWeight: '600',
  },
})
