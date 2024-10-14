import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';


export default function BeerShow() {
  const { id } = useLocalSearchParams(); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Cerveza</Text>
      <Text>ID de la Cerveza: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
