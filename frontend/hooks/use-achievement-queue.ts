import { createElement } from 'react'
import { useCallback, useRef } from 'react'
import { AchievementModal } from '@/components/modals/AchievementModal'
import { UserAchievement } from '@/types/achievements'
import { useModal } from '@/context/modal-context'

export const useAchievementQueue = () => {
  const { showModal, hideModal } = useModal()
  const queueRef = useRef<UserAchievement[]>([])
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
      createElement(AchievementModal, {
        achievement: next,
        onClose: showNext,
      }),
      { closeOnBackdrop: false }
    )
  }, [showModal, hideModal])

  const enqueue = useCallback(
    (achievements: UserAchievement[]) => {
      queueRef.current.push(...achievements)

      if (!isShowingRef.current) {
        showNext()
      }
    },
    [showNext]
  )

  return { enqueue }
}
