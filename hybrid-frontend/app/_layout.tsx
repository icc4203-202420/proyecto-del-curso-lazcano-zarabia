import React from "react";
import { ActivityIndicator, View } from "react-native";

import { Stack } from "expo-router";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  
  const [fontsLoaded] = useFonts({
    'Chococooky': require('@/assets/fonts/Chococooky.ttf'), 
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
