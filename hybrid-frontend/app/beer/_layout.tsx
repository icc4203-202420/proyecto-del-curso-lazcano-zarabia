import React from "react";
import { Stack } from "expo-router";

export default function BeerLayout() {
  return (
    <Stack>
      <Stack.Screen name="show/[id]" options={{ title: "Detalles de la Cerveza" }} />
    </Stack>
  );
}
