import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Beer {
  id: string;
  name: string;
  type: 'beer';
}

interface User {
  id: string;
  handle: string;
  name: string;
  type: 'user';
}

interface Bar {
  id: string;
  name: string;
  type: 'bar';
}

type SearchResult = Beer | User | Bar;

export default function index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar si el usuario está autenticado
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      router.push('/profile'); // Redirige al perfil si está logueado
    } else {
      router.push('/login'); // Redirige al login si no está logueado
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      setError(null);

      // Hacer las tres solicitudes a la API
      Promise.all([
        fetch(`http://127.0.0.1:3001/api/v1/beers`).then((response) => response.json()),
        fetch(`http://127.0.0.1:3001/api/v1/users`).then((response) => response.json()),
        fetch(`http://127.0.0.1:3001/api/v1/bars`).then((response) => response.json()),
      ])
        .then(([beersData, usersData, barsData]) => {
          // Filtrar y estructurar los resultados de cervezas
          const filteredBeers = beersData.beers
            .filter((beer: any) => beer.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((beer: any) => ({ ...beer, type: 'beer' }));

          // Filtrar y estructurar los resultados de usuarios
          const filteredUsers = usersData.users
            .filter((user: any) => user.handle.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((user: any) => ({ ...user, type: 'user' }));

          // Filtrar y estructurar los resultados de bares
          const filteredBars = barsData.bars
            .filter((bar: any) => bar.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((bar: any) => ({ ...bar, type: 'bar' }));

          // Combinar los resultados
          setResults([...filteredBeers, ...filteredUsers, ...filteredBars]);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al buscar cervezas, usuarios y bares');
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Introduce un término de búsqueda..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                item.type === 'beer'
                  ? router.push(`/beer/${item.id}`)
                  : item.type === 'user'
                  ? router.push(`/user/${item.id}`)
                  : router.push(`/bar/${item.id}`) // Ruta para los bares
              }
            >
              <Text style={styles.item}>
                {item.type === 'beer' ? `🍺 ${item.name}` : item.type === 'user' ? `👤 ${item.handle}` : `🏠 ${item.name}`}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={!loading && <Text>No se encontraron resultados.</Text>}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Botón para ir al perfil o login */}
      <Button title="Ir a Perfil" onPress={checkAuthentication} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});
