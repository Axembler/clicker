import { View, Text, ScrollView, StyleSheet, DimensionValue, TouchableOpacity } from 'react-native'
import { memo, useMemo } from 'react'
import { Achievement } from '@/types/achievements'
import { useAchievements } from '@/hooks/use-achievements'
import { formatDate } from '@/helpers/formatDate'
import { usePrestige } from '@/hooks/use-prestige'
import { formatNumber } from '@/helpers/formatNumber'
import { LoadingBanner } from '@/components/ui/LoadingBanner'

export default function Achievements() {
  const { data, total, unlocked, isLoading } = useAchievements()
  const { openPrestigeModal } = usePrestige()

  const isInitialLoading = isLoading && !data

  const progressPercent = useMemo(() => {
    if (!data) return 0

    return total > 0 ? Math.round((unlocked / total) * 100) : 0
  }, [data])

  const progressBarStyle = useMemo(
    () => [styles.progressBarFill, { width: `${progressPercent}%` as DimensionValue }],
    [progressPercent]
  )

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Достижения</Text>

            {data && unlocked === total ? (
              <TouchableOpacity
                style={styles.allUnlockedButton}
                onPress={openPrestigeModal}
                activeOpacity={0.8}
              >
                <Text style={styles.allUnlockedButtonText}>🎉 Престиж!</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.headerSubtitle}>
                {`${unlocked} / ${total} открыто`}
              </Text>
            )}
          </View>

          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeLabel}>Прогресс</Text>
            {isInitialLoading ? (
              <Text style={styles.progressBadgeValue}>...</Text>
            ) : data ? (
              <Text style={styles.progressBadgeValue}>
                🏆 {progressPercent}%
              </Text>
            ) : (
              <Text style={styles.progressBadgeValue}>—</Text>
            )}
          </View>
        </View>

        {data && (
          <View style={styles.progressBarContainer}>
            <View style={progressBarStyle} />
          </View>
        )}
      </View>

      {isInitialLoading
        ? <LoadingBanner message='Загрузка достижений...' />
        : <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {data?.map((achievement: Achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </ScrollView>
      }
    </View>
  )
}

const AchievementCard = memo(({ achievement }: { achievement: Achievement}) => {
  const { unlocked, title, description, reward, unlockedAt } = achievement

  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      <View style={[styles.iconContainer, unlocked ? styles.iconUnlocked : styles.iconLocked]}>
        <Text style={styles.iconEmoji}>{unlocked ? '🏆' : '🔒'}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            style={[styles.cardTitle, !unlocked && styles.textMuted]}
            numberOfLines={1}
          >
            {title ?? description}
          </Text>

          <View style={[styles.rewardBadge, unlocked && styles.rewardBadgeUnlocked]}>
            <Text style={[styles.rewardText, unlocked && styles.rewardTextUnlocked]}>
              🪙 {formatNumber(reward.coins)}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardDescription, !unlocked && styles.textMuted]} numberOfLines={2}>
          {description}
        </Text>

        {unlocked && unlockedAt && (
          <Text style={styles.unlockedDate}>Открыто {formatDate(unlockedAt)}</Text>
        )}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 12,
    paddingTop: 24,
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

  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  allUnlockedButton: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  allUnlockedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
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
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  progressBadgeValue: {
    fontSize: 16,
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
  },

  list: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    gap: 14,
    borderWidth: 1.5,
    borderColor: '#F0EBFF',
    shadowColor: '#C4B5FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardUnlocked: {
    borderColor: '#c4b2fa',
    backgroundColor: '#FDFBFF',
    shadowOpacity: 0.18,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconUnlocked: {
    backgroundColor: '#EDE9FE',
  },
  iconLocked: {
    backgroundColor: '#F3F4F6',
  },
  iconEmoji: {
    fontSize: 26,
  },

  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  unlockedDate: {
    fontSize: 11,
    color: '#A78BFA',
    marginTop: 2,
    fontWeight: '500',
  },

  rewardBadge: {
    width: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rewardBadgeUnlocked: {
    backgroundColor: '#EDE9FE',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  rewardTextUnlocked: {
    color: '#7C3AED',
  },

  textMuted: {
    color: '#BBBBBB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },
  errorEmoji: {
    fontSize: 40,
  },
  errorText: {
    fontSize: 15,
    color: '#EF4444',
    textAlign: 'center',
  },
})
