import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface User {
  id: string;
  handle: string;
  first_name: string;
  email: string;
  // Agrega otros campos según la información del usuario
}

export default function UserDetail() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Obtener el ID de los parámetros de la URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data); // Suponiendo que `data` contiene la información del usuario
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario');
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Handle: {user.handle}</Text>
          <Text style={styles.text}>Nombre: {user.first_name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          {/* Agrega más campos según la información que tengas */}
        </>
      ) : (
        <Text>No se encontró la información del usuario.</Text>
      )}

        <Button title="Volver a Inicio" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
