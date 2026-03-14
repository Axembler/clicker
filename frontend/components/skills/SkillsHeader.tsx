import { DimensionValue, StyleSheet, Text, View } from "react-native"
import { memo, useMemo } from "react"

interface Props {
  talentPoints: number
  unlockedNodes: number
  totalNodes: number
}

export const SkillsHeader = memo(({ talentPoints, unlockedNodes, totalNodes }: Props) => {
  const progressPercent = useMemo(() => {
    return totalNodes > 0 ? Math.round((unlockedNodes / totalNodes) * 100) : 0
  }, [])

  const progressBarStyle = useMemo(
    () => [styles.progressBarFill, { width: `${progressPercent}%` as DimensionValue }],
    [progressPercent]
  )

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Таланты</Text>

          <Text style={styles.headerSubtitle}>
            Открыто: {unlockedNodes} / {totalNodes}
          </Text>
        </View>

        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeLabel}>Очки талантов</Text>
          
          <Text style={styles.progressBadgeValue}>
            ✨ {talentPoints} ОТ
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={progressBarStyle} />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    width: 210
  },
  progressBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  progressBadgeLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  progressBadgeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C3AED',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#EDE9FE',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A78BFA',
    borderRadius: 999,
  }
})