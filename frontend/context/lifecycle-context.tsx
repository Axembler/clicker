// context/lifecycle-context.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAppLifecycle } from '@/hooks/use-app-lifecycle'

interface ToastState {
  earned: number
  seconds: number
  key: number
}

interface LifecycleContextType {
  toast: ToastState
}

const LifecycleContext = createContext<LifecycleContextType>({
  toast: { earned: 0, seconds: 0, key: 0 }
})

export const useLifecycleContext = () => useContext(LifecycleContext)

export function LifecycleProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    earned: 0,
    seconds: 0,
    key: 0
  })

  const handleWakeUp = useCallback(({ passiveEarned, passiveSeconds }: {
    passiveEarned: number
    passiveSeconds: number
  }) => {
    if (passiveEarned > 0) {
      setToast(prev => ({
        earned: passiveEarned,
        seconds: passiveSeconds,
        key: prev.key + 1
      }))
    }
  }, [])

  useAppLifecycle({ onWakeUp: handleWakeUp })

  return (
    <LifecycleContext.Provider value={{ toast }}>
      {children}
    </LifecycleContext.Provider>
  )
}
