import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { AuthProvider } from '@/context/auth-context'
import { NotificationProvider } from '@/context/notification-context'
import { useOTAUpdate } from '@/hooks/use-ota-update'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'
import { apiUrl } from '@/utils/apiUrl'

export const unstable_settings = {
  anchor: '(tabs)'
}

export default function RootLayout() {
  const { isUpdating } = useOTAUpdate()

  useEffect(() => {
    console.log('API URL:', apiUrl)
  }, [])

  if (isUpdating) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#943fd5" />

        <Text style={styles.text}>Загрузка обновления...</Text>
      </View>
    )
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  text: {
    fontSize: 16,
    color: '#393939'
  }
})