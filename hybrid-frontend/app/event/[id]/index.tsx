import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/UserContext';
import axiosInstance from '@/config/axiosInstance';
import * as ImagePicker from 'expo-image-picker';

export default function EventDetail() {
  const [pictures, setPictures] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { id } = useLocalSearchParams();
  const { userId } = useUser();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPictures();
  }, [id]);

  const fetchPictures = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/events/${id}/event_pictures`);
      setPictures(response.data.pictures);
      console.log("Pictures fetched successfully:", response.data.pictures);
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      Alert.alert('Error', 'No se pudo obtener las imágenes del evento');
    }
  };

  const chooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0]);
      console.log("Selected image:", result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Upload Status', 'Please select an image to upload.');
      return;
    }
    setIsUploading(true);

    const base64Image = selectedImage.base64;
    const data = {
      event_picture: {
        user_id: userId,
        flyer_base64: `data:image/jpeg;base64,${base64Image}`,
      },
    };

    try {
      const response = await axiosInstance.post(`/api/v1/events/${id}/add_images`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to upload image, status: ${response.status}`);
      }

      Alert.alert('Upload Status', 'Image uploaded successfully.');
      fetchPictures(); // Refresh the list of images
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Status', 'Error uploading image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotos del Evento</Text>
      <Button title="Escoger Imagen" onPress={chooseImage} />

      {/* Muestra una previsualización de la imagen seleccionada */}
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Previsualización:</Text>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <Button title="Guardar Imagen" onPress={uploadImage} disabled={isUploading} />
        </View>
      )}

      {uploading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={pictures}
        keyExtractor={(item) => item.id.toString()}
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
  previewContainer: { marginTop: 20, alignItems: 'center' },
  previewText: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
});
