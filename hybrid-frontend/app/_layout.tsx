import React, {useEffect} from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { UserProvider } from '@/context/UserContext'; // Importa el UserProvider
import { ConfigProvider } from "@/context/NgrokContext";

export default function RootLayout() {
  
  return (
    <ConfigProvider>
      <UserProvider> 
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </UserProvider>
    </ConfigProvider>
  );
}
