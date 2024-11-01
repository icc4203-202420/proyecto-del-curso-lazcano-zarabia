import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/UserContext';

interface Picture {
  id: string;
  image_url: string | null;
}

export default function EventDetail() {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [uploading, setUploading] = useState(false);
  const { id } = useLocalSearchParams();
  const { userId } = useUser(); 

  const fetchPictures = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id}/event_pictures`);
      if (response.ok) {
        const data = await response.json();
        setPictures(data.pictures);
      } else {
        Alert.alert('Error', 'No se pudo obtener las imágenes del evento');
      }
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, [id]);

  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  // Función para subir la imagen seleccionada
  const uploadImage = async (uri: string) => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }

    setUploading(true);

    let formData = new FormData();
    formData.append('flyers[]', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('user_id', userId);

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id}/add_images`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Imagen subida', 'La imagen se ha subido exitosamente');
        fetchPictures(); // Actualiza las imágenes después de subir la nueva imagen
      } else {
        Alert.alert('Error', 'No se pudo subir la imagen');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotos del Evento</Text>

      {/* Botón para seleccionar y subir una imagen */}
      <Button title="Subir Imagen" onPress={pickImage} />

      {uploading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={pictures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <Text>Imagen no disponible</Text>
          )
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 200, height: 200, marginBottom: 10 },
});
