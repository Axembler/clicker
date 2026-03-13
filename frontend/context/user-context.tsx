import { createContext, useContext, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react'
import { getUser } from '@/services/user'
import { UserData } from '@/types/user'
import { useFocusEffect } from 'expo-router'

interface UserContextType {
  user: UserData | null
  isLoading: boolean
  error: string | null
  refetchUser: () => Promise<void>
  setUser: Dispatch<SetStateAction<UserData | null>>
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  refetchUser: async () => {},
  setUser: () => {},
})

export const useUserContext = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getUser()
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchUser()
    }, [fetchUser])
  )

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        refetchUser: fetchUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
