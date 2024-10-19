import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Beer {
  id: string;
  name: string;
  style: string;
}

export default function index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      fetch(`http://127.0.0.1:3001/api/v1/beers`)
        .then((response) => response.json())
        .then((data) => {
          const filteredBeers = data.beers.filter((beer: any) =>
            beer.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setBeers(filteredBeers);
          setLoading(false);
        })
        .catch(() => {
          setError('Error fetching beers');
          setLoading(false);
        });
    } else {
      setBeers([]); 
    }
  }, [searchTerm]);

  const filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Introduce un termino de busqueda..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
        data={beers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/beer/${item.id}`)} 
          >
            <Text style={styles.item}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading && <Text>No se encontraron cervezas.</Text>}
      />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
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
