import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { AuthProvider } from '@/context/auth-context'
import { NotificationProvider } from '@/context/notification-context'

export const unstable_settings = {
  anchor: '(tabs)'
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
        
        <StatusBar style="auto" />
      </NotificationProvider>
    </AuthProvider>
  )
}
