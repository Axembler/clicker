import { CheckedAchievement } from '@/types/achievements'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface AchievementModalProps {
  achievement: CheckedAchievement
  onClose: () => void
}

export function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>🏆 Новое достижение!</Text>

      {achievement.title && (
        <Text style={styles.title}>{achievement.title}</Text>
      )}

      <Text style={styles.description}>{achievement.description}</Text>

      {achievement.reward?.coins > 0 && (
        <Text style={styles.reward}>+{achievement.reward.coins} монет 🪙</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Забрать</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    gap: 8,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 4,
  },
  badge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4C1D95',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#A78BFA',
    textAlign: 'center',
    marginBottom: 4,
  },
  reward: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C3AED',
  },
  button: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})