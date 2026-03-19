import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { AuthProvider } from '@/context/auth-context'
import { NotificationProvider } from '@/context/notification-context'
import { useOTAUpdate } from '@/hooks/use-ota-update'
import { ChangelogModal } from '@/components/modals/ChangelogModal'

export default function RootLayout() {
  const { showChangelog, changelog, dismissChangelog } = useOTAUpdate()

  return (
    <AuthProvider>
      <NotificationProvider>
        <Stack>
          <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />
          <Stack.Screen name="login"    options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style="auto" />

        <ChangelogModal
          visible={showChangelog}
          changelog={changelog}
          onDismiss={dismissChangelog}
        />
      </NotificationProvider>
    </AuthProvider>
  )
}
