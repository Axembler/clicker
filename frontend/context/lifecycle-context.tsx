import { createContext, useContext, useCallback, ReactNode } from 'react'
import { useAppLifecycle } from '@/hooks/use-app-lifecycle'
import { useUser } from './user-context'
import { useModal } from './modal-context'
import { PassiveIncomeModal } from '@/components/modals/PassiveIncomeModal'

const LifecycleContext = createContext({})

export const useLifecycleContext = () => useContext(LifecycleContext)

export function LifecycleProvider({ children }: { children: ReactNode }) {
  const { setUser } = useUser()
  const { showModal } = useModal()

  const handleWakeUp = useCallback(({ passiveEarned, passiveSeconds }: {
    passiveEarned: number
    passiveSeconds: number
  }) => {
    if (passiveEarned > 0) {
      showModal(<PassiveIncomeModal earned={passiveEarned} seconds={passiveSeconds} />)

      setUser((prev) => {
        if (!prev) return null
        return { ...prev, coins: prev.coins + passiveEarned }
      })
    }
  }, [showModal, setUser])

  useAppLifecycle({ onWakeUp: handleWakeUp })

  return (
    <LifecycleContext.Provider value={{}}>
      {children}
    </LifecycleContext.Provider>
  )
}
