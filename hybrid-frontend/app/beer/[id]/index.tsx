import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Bar {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface Brewery {
  id: number;
  name: string;
}

interface Beer {
  id: number;
  name: string;
  style: string;
  alcohol: string;
  avg_rating: number;
  bars: Bar[]; // Lista de bares
  breweries: Brewery[]; // Lista de cervecerías
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
        setBeer(result.beer); 
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
          <Text style={styles.title}>
            Detalles de la Cerveza {beer.name} <Icon name="star" size={20} color="#FFD700" style={{ marginLeft: 5 }} /> {beer.avg_rating ? beer.avg_rating.toFixed(2) : 'N/A'}
          </Text>
          <Text>Estilo: {beer.style}</Text>
          <Text>Alcohol: {beer.alcohol}</Text>
          <Button 
            title="Reseñas" 
            onPress={() => router.push(`/beer/${id}/review`)}
          />
          
          {/* Sección para mostrar los bares */}
          <Text style={styles.subtitle}>Bares donde se sirve esta cerveza:</Text>
          {beer.bars.length > 0 ? (
            <FlatList
              data={beer.bars}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.barItem}>
                  <Text style={styles.barText}>Nombre: {item.name}</Text>
                  <Text style={styles.barText}>Latitud: {item.latitude}</Text>
                  <Text style={styles.barText}>Longitud: {item.longitude}</Text>
                </View>
              )}
            />
          ) : (
            <Text>No se han encontrado bares que sirvan esta cerveza.</Text>
          )}

          {/* Sección para mostrar las cervecerías */}
          <Text style={styles.subtitle}>Cervecerías:</Text>
          {beer.breweries.length > 0 ? (
            <FlatList
              data={beer.breweries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.breweryItem}>
                  <Text style={styles.breweryText}>Nombre: {item.name}</Text>
                </View>
              )}
            />
          ) : (
            <Text>No se ha encontrado una cervecería asociada.</Text>
          )}
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  barItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  barText: {
    fontSize: 16,
  },
  breweryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  breweryText: {
    fontSize: 16,
  },
});
