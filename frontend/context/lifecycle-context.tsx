import { createContext, useContext, useCallback, ReactNode } from 'react'
import { useAppLifecycle } from '@/hooks/use-app-lifecycle'
import { useUserContext } from './user-context'
import { useModal } from './modal-context'
import { PassiveIncomeModal } from '@/components/PassiveIncomeModal'

const LifecycleContext = createContext({})

export const useLifecycleContext = () => useContext(LifecycleContext)

export function LifecycleProvider({ children }: { children: ReactNode }) {
  const { setUser } = useUserContext()
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
  }, [])

  useAppLifecycle({ onWakeUp: handleWakeUp })

  return (
    <LifecycleContext.Provider value={{}}>
      {children}
    </LifecycleContext.Provider>
  )
}
