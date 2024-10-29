import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { UserProvider } from '@/context/UserContext'; // Importa el UserProvider

export default function RootLayout() {
  return (
    <UserProvider> 
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </UserProvider>
  );
}
