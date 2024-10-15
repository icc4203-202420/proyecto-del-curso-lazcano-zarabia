import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Beer {
  id: number;
  name: string;
  style: string;
  alcohol: string;
}

export default function BeerShow() {
  const { id } = useLocalSearchParams(); 
  const [beer, setBeer] = useState<Beer | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch beer details');
        }
        const result = await response.json();
        console.log("Datos recibidos del backend:", result);
        setBeer(result.beer); // Aquí almacenamos el objeto beer directamente
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching beer details:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchBeerDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles de la cerveza...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error al cargar los detalles de la cerveza.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {beer && (
        <>
          <Text style={styles.title}>Detalles de la Cerveza {beer.name}</Text>
          <Text>Estilo: {beer.style}</Text>
          <Text>Alcohol: {beer.alcohol} </Text>
          <Button 
            title="Hacer una Reseña" 
            onPress={() => router.push(`/beer/review?id=${id}`)} 
          />
        </>
      )}
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
