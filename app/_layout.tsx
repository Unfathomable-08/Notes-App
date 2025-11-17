import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons'
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  return (
     <Tabs
        screenOptions={{
           headerShown: false,
           tabBarActiveTintColor: '#007AFF',
           tabBarInactiveTintColor: '#8E8E93',
           tabBarStyle: {
              backgroundColor: '#F8F8F8',
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0
           },
        }}
     >
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
        <Tabs.Screen name="notes" options={{ title: 'Notes', tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} /> }} />
        <Tabs.Screen name="setting" options={{ title: 'Settings', tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} /> }} />

        <Tabs.Screen name="[id]" options={{ href: null }} />
        <Tabs.Screen name="(auth)" options={{ href: null }} />
        <Tabs.Screen name="(auth)/login" options={{ href: null }} />
     </Tabs>
  )
}
