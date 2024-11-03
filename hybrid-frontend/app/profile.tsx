import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axiosInstance from '@/config/axiosInstance'; // Importa tu axiosInstance configurado

interface UserProfile {
  id: number;
  first_name: string;
  handle: string;
  email: string;
  // Agrega otros campos según el perfil de usuario
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Función para obtener el perfil del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No se encontró el token de autenticación');
          router.push('/login'); // Redirigir al login si no hay token
          return;
        }

        // Usa axiosInstance para hacer la solicitud GET
        const response = await axiosInstance.get('/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setProfile(response.data); // Asumiendo que `response.data` contiene el perfil
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      Alert.alert('Sesión cerrada');
      router.push('/login'); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <Text style={styles.text}>Nombre: {profile.first_name}</Text>
          <Text style={styles.text}>Handle: {profile.handle}</Text>
          <Text style={styles.text}>Email: {profile.email}</Text>

          <Button title="Cerrar Sesión" onPress={handleLogout} color="#FF0000" />
        </>
      ) : (
        <Text>No se pudo cargar el perfil</Text>
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
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
