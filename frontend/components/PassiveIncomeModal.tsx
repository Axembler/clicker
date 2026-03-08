import { useModal } from '@/context/modal-context'
import { formatSeconds } from '@/helpers/formatSeconds'
import { useAchievementQueue } from '@/hooks/use-achievement-queue'
import { checkAchievements } from '@/services/achievements'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
  earned: number
  seconds: number
}

export const PassiveIncomeModal = ({ earned, seconds }: Props) => {
  const { hideModal } = useModal()
  const { enqueue } = useAchievementQueue()

  const hideModalHandler = async () => {
    hideModal()

    const { newAchievements } = await checkAchievements()
      
    if (newAchievements.length > 0) {
      setTimeout(() => {
        enqueue(newAchievements)
      }, 350)
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>💰</Text>
      <Text style={styles.title}>Пока тебя не было</Text>

      <View style={styles.divider} />

      <Text style={styles.earned}>+{earned} монет</Text>
      <Text style={styles.time}>за {formatSeconds(seconds)}</Text>

      <TouchableOpacity style={styles.button} onPress={hideModalHandler} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Забрать</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
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
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4C1D95',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EDE9FE',
    marginBottom: 16,
  },
  earned: {
    fontSize: 36,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 6,
  },
  time: {
    fontSize: 14,
    color: '#A78BFA',
    marginBottom: 28,
  },
  button: {
    width: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 14,
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
