import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { AuthProvider } from '@/context/auth-context'
import { NotificationProvider } from '@/context/notification-context'
import { useOTAUpdate } from '@/hooks/use-ota-update'
import { LoadingBanner } from '@/components/ui/LoadingBanner'

export const unstable_settings = {
  anchor: '(tabs)'
}

export default function RootLayout() {
  const { isUpdating } = useOTAUpdate()

  if (isUpdating) {
    return <LoadingBanner message='Загрузка обновления...' />
  }

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