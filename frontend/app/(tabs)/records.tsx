import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useCallback, useMemo } from 'react'
import { ItemSeparator, ListEmpty, MyRankCard, StatsRow, TableHeader, TableRow } from '@/components/records'
import { formatNumber } from '@/helpers/formatNumber'
import { useRecords } from '@/hooks/use-records'
import { RecordEntry } from '@/types/records'
import { LoadingBanner } from '@/components/ui/LoadingBanner'

export default function RecordsScreen() {
  const { data, myRank, isLoading } = useRecords()

  const isInitialLoading = isLoading && !data

  const { totalClicks, totalCoins } = useMemo(
    () => (data ?? []).reduce(
      (acc, r) => ({
        totalClicks: acc.totalClicks + (r.totalClicks || 0),
        totalCoins: acc.totalCoins + (r.totalCoins || 0),
      }),
      { totalClicks: 0, totalCoins: 0 }
    ), [data]
  )

  const renderItem = useCallback(
    ({ item, index }: { item: RecordEntry; index: number }) => (
      <TableRow item={item} index={index} />
    ), []
  )

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

        {isInitialLoading 
          ? <LoadingBanner message='Загрузка рекордов...' />
          
          : <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
            scrollEnabled={data ? data.length > 6 : false}
            ListEmptyComponent={ListEmpty}
          />
        }
      </View>

      {myRank && <MyRankCard myRank={myRank} />}

      <StatsRow
        length={data ? data.length : 0}
        totalClicks={formatNumber(totalClicks)}
        totalCoins={formatNumber(totalCoins)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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
    minHeight: 232,
    maxHeight: 380,
  },
  tableDivider: {
    height: 1,
    backgroundColor: '#EDE9FE',
    marginBottom: 8,
  }
})
