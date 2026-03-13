import { useUserContext } from '@/context/user-context'
import { useModal } from '@/context/modal-context'
import { useNotification } from '@/context/notification-context'
import { prestige } from '@/services/user'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { PrestigeModal } from '@/components/modals/PrestigeModal'
import { router } from 'expo-router'

export const usePrestige = () => {
  const { user, setUser, refetchUser } = useUserContext()
  const { showModal, hideModal } = useModal()
  const { notify } = useNotification()

  const handleConfirm = async () => {
    try {
      const res = await prestige()

      setUser((prev) =>
        prev ? { ...prev, coins: res.coins, clicks: res.clicks } : null
      )

      hideModal()

      setTimeout(
        () => notify('success', res.message),
        350
      )

      await refetchUser()

      router.replace('/(tabs)')
    } catch (error) {
      notify('error', getErrorMessage(error))
    }
  }

  const openPrestigeModal = () => {
    showModal(
      <PrestigeModal
        prestige={user?.prestige && user?.prestige + 1}
        onCancel={hideModal}
        onConfirm={handleConfirm}
      />
    )
  }

  return { openPrestigeModal }
}
