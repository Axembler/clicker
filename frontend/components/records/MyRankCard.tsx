import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { formatNumber } from "@/helpers/formatNumber"

type MyRank = {
  rank: number
  user: {
    username: string
    clicks: number
    totalCoins: number
  }
}

export const MyRankCard = memo(({ myRank }: { myRank: MyRank }) => (
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
))

const styles = StyleSheet.create({
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
})