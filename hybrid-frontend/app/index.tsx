import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Beer {
  id: string;
  name: string;
  style: string;
}

export default function BeerSearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

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
      setBeers([]); // Si no hay búsqueda, no mostrar ninguna cerveza
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
          data={filteredBeers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.name}</Text>
          )}
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
