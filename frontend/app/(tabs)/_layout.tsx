import React from 'react'
import { Tabs } from 'expo-router'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { AuthGuard } from '@/components/authGuard'
import { LifecycleProvider } from '@/context/lifecycle-context'
import { UserProvider } from '@/context/user-context'
import { ModalProvider } from '@/context/modal-context'

export default function TabLayout() {
  return (
    <AuthGuard>
      <ModalProvider>
        <UserProvider>
          <LifecycleProvider>
            <Tabs
              screenOptions={{
                headerShown: false
              }}>
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Кликать',
                  tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
              />
              <Tabs.Screen
                name="shop"
                options={{
                  title: 'Магазин',
                  tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
              />
              <Tabs.Screen
                name="records"
                options={{
                  title: 'Рекорды',
                  tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
              />
            </Tabs>
          </LifecycleProvider>
        </UserProvider>
      </ModalProvider>
    </AuthGuard>
  )
}
