import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import {jwtDecode} from 'jwt-decode';

interface User {
  id: string;
  handle: string;
  first_name: string;
  email: string;
}

interface JwtPayload {
    sub: string; 
  }

export default function UserDetail() {
  const [user, setUser] = useState<User | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useGlobalSearchParams(); 

  const fetchAuthenticatedUserId = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        return decodedToken.sub; 
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario');
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener la información del usuario');
      }
    };

    const checkFriendStatus = async () => {
      const authenticatedUserId = await fetchAuthenticatedUserId();
      if (authenticatedUserId && id) {
        try {
          const response = await fetch(`http://127.0.0.1:3001/api/v1/users/${authenticatedUserId}/friendships/${id}`);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              setIsFriend(true); 
            }
          } else {
            setIsFriend(false);
          }
        } catch (error) {
            setIsFriend(false);
        }
      }
    };

    fetchUserData();
    checkFriendStatus();
    setLoading(false);
  }, [id]);

  const handleAddFriend = async () => {
    const authenticatedUserId = await fetchAuthenticatedUserId();
    if (authenticatedUserId && id) {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/v1/friendships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friendship: {
              user_id: authenticatedUserId,
              friend_id: id,
            },
          }),
        });

        if (response.ok) {
          Alert.alert('Éxito', 'Solicitud de amistad enviada');
          setIsFriend(true);
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.error || 'No se pudo enviar la solicitud de amistad');
        }
      } catch (error) {
        console.error('Error al enviar solicitud de amistad:', error);
        Alert.alert('Error', 'Ocurrió un error al enviar la solicitud de amistad');
      }
    }
  };

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

          {isFriend ? (
            <Text style={styles.friendText}>Ya son amigos</Text>
          ) : (
            <Button title="Agregar como amigo" onPress={handleAddFriend} />
          )}
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
  friendText: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
});
