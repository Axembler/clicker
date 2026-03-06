import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { LifecycleProvider } from '@/context/lifecycle-context'
import { UserProvider } from '@/context/user-context'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {

  return (
    <UserProvider>
      <LifecycleProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        
        <StatusBar style="auto" />
      </LifecycleProvider>
    </UserProvider>
  )
}
