import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Achievement, AchievementsResponse } from '@/types/achievements'
import { getAchievements } from '@/services/achievements'

export default function Achievements() {
  const [data, setData] = useState<AchievementsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAchievements = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      setError(null)
      const result = await getAchievements()
      setData(result)
    } catch (e) {
      setError('Не удалось загрузить достижения')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const sort = (data: Achievement[] | undefined) => [...(data ?? [])].sort((a, b) => {
    const fieldComparison = a.condition.field.localeCompare(b.condition.field)
    
    if (fieldComparison !== 0) return fieldComparison
    
    return a.condition.value - b.condition.value
  })

  const onRefresh = () => {
    setIsRefreshing(true)
    fetchAchievements(true)
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  return (
    <View style={styles.container}>
      {/* Декоративные круги */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Шапка */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Достижения</Text>
            <Text style={styles.headerSubtitle}>
              {data ? `${data.unlocked} / ${data.total} открыто` : '...'}
            </Text>
          </View>

          {/* Прогресс-бейдж */}
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeLabel}>Прогресс</Text>
            {isLoading ? (
              <Text style={styles.progressBadgeValue}>...</Text>
            ) : data ? (
              <Text style={styles.progressBadgeValue}>
                🏆 {data.total > 0 ? Math.round((data.unlocked / data.total) * 100) : 0}%
              </Text>
            ) : (
              <Text style={styles.progressBadgeValue}>—</Text>
            )}
          </View>
        </View>

        {/* Прогресс-бар */}
        {data && (
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${data.total > 0
                    ? Math.round((data.unlocked / data.total) * 100)
                    : 0}%`,
                },
              ]}
            />
          </View>
        )}
      </View>

      {/* Контент */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#A78BFA" />
          <Text style={styles.loadingText}>Загрузка достижений...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#A78BFA"
            />
          }
        >
          {sort(data?.achievements ?? []).map((achievement: Achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

// ─── Карточка достижения ──────────────────────────────────────────────────────

interface AchievementCardProps {
  achievement: Achievement
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const { unlocked, title, description, reward, unlockedAt } = achievement

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      {/* Иконка */}
      <View style={[styles.iconContainer, unlocked ? styles.iconUnlocked : styles.iconLocked]}>
        <Text style={styles.iconEmoji}>{unlocked ? '🏆' : '🔒'}</Text>
      </View>

      {/* Основной контент */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            style={[styles.cardTitle, !unlocked && styles.textMuted]}
            numberOfLines={1}
          >
            {title ?? description}
          </Text>

          {/* Награда */}
          <View style={[styles.rewardBadge, unlocked && styles.rewardBadgeUnlocked]}>
            <Text style={[styles.rewardText, unlocked && styles.rewardTextUnlocked]}>
              🪙 {reward.coins}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardDescription, !unlocked && styles.textMuted]} numberOfLines={2}>
          {description}
        </Text>

        {/* Дата открытия */}
        {unlocked && formattedDate && (
          <Text style={styles.unlockedDate}>Открыто {formattedDate}</Text>
        )}
      </View>
    </View>
  )
}

// ─── Стили ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 12,
    paddingTop: 24,
  },

  // Декоративные круги
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

  // Шапка
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

  // Прогресс-бейдж
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

  // Прогресс-бар
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

  // Список
  list: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },

  // Карточка
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

  // Иконка
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

  // Контент карточки
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

  // Награда
  rewardBadge: {
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

  // Утилиты
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
