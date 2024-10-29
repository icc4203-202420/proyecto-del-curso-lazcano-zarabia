import React from "react";
import { Stack } from "expo-router";

export default function BarLayout() {
  return (
    <Stack>
      <Stack.Screen name="show/[id]" options={{ title: "Detalles del bar" }} />
    </Stack>
  );
}
