import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"

interface Props {
  length: number
  totalClicks: string
  totalCoins: string
}

export const StatsRow = memo(({ length, totalClicks, totalCoins }: Props) => (
  <View style={styles.statsRow}>
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>👥</Text>
      <Text style={styles.statValue}>{length}</Text>
      <Text style={styles.statLabel}>Players</Text>
    </View>

    <View style={styles.statDivider} />

    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>👆</Text>
      <Text style={styles.statValue}>{totalClicks}</Text>
      <Text style={styles.statLabel}>Всего кликов</Text>
    </View>

    <View style={styles.statDivider} />

    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>🪙</Text>
      <Text style={styles.statValue}>{totalCoins}</Text>
      <Text style={styles.statLabel}>Всего монет</Text>
    </View>
  </View>
))

const styles = StyleSheet.create({
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