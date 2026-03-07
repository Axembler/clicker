import { useCallback, useRef } from 'react'
import { AchievementModal } from '@/components/AchievementModal'
import React from 'react'
import { CheckedAchievement } from '@/types/achievements'
import { useModal } from '@/context/modal-context'

export const useAchievementQueue = () => {
  const { showModal, hideModal } = useModal()
  const queueRef = useRef<CheckedAchievement[]>([])
  const isShowingRef = useRef(false)

  const showNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      isShowingRef.current = false

      hideModal()

      return
    }

    const next = queueRef.current.shift()!
    
    isShowingRef.current = true

    showModal(
      React.createElement(AchievementModal, {
        achievement: next,
        onClose: showNext,
      }),
      { closeOnBackdrop: false }
    )
  }, [showModal, hideModal])

  const enqueue = useCallback(
    (achievements: CheckedAchievement[]) => {
      queueRef.current.push(...achievements)

      if (!isShowingRef.current) {
        showNext()
      }
    },
    [showNext]
  )

  return { enqueue }
}
