import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/UserContext';
import axiosInstance from '@/config/axiosInstance';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function EventDetail() {
  const [pictures, setPictures] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { id } = useLocalSearchParams();
  const { userId } = useUser();
  
  const [endDate, setEndDate] = useState(null); // New state for end_date
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    fetchPictures();
    fetchUsers();
    fetchEventDetails();
    fetchVideoUrl(); 
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/events/${id}`);
      const event = response.data;
      setEndDate(event.end_date); // Store end_date as a Date object
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'No se pudo obtener los detalles del evento');
    }
  };

  const fetchVideoUrl = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/events/${id}/video_url`);
      setVideoUrl(response.data.video_url); // Asigna la URL del video
    } catch (error) {
      console.error('Error al obtener la URL del video:', error);
      Alert.alert('Error', 'No se pudo obtener la URL del video del evento');
    }
  };

  const fetchPictures = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/events/${id}/event_pictures`);
      const picturesData = response.data.pictures;

      console.log('Pictures:', picturesData);

      const picturesWithTags = await Promise.all(
        picturesData.map(async (picture) => {
          try {
            const tagsResponse = await axiosInstance.get(
              `/api/v1/events/${id}/event_pictures/${picture.id}/tags`
            );
            picture.tags = tagsResponse.data.tags;
          } catch (error) {
            console.error(`Error fetching tags for picture ${picture.id}:`, error);
            picture.tags = []; 
          }
          return picture;
        })
      );

      setPictures(picturesWithTags);
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      Alert.alert('Error', 'No se pudo obtener las imágenes del evento');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/users'); 
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      Alert.alert('Error', 'No se pudo obtener la lista de usuarios');
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

  const addTagToPicture = async (pictureId) => {
    if (!selectedUserId) {
      Alert.alert('Añadir Tag', 'Por favor selecciona un usuario.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/v1/events/${id}/event_pictures/${pictureId}/tags`, {
        user_id: selectedUserId,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to add tag, status: ${response.status}`);
      }
      fetchPictures(); 

      Alert.alert('Añadir Tag', 'Usuario etiquetado correctamente.');
    } catch (error) {
      console.error('Error al etiquetar al usuario:', error);
      Alert.alert('Añadir Tag', 'Error al etiquetar al usuario.');
    }
  };

  const generateVideo = async () => {
    try {
      // Realiza una solicitud POST para generar el video
      const response = await axiosInstance.post(`/api/v1/events/${id}/generate_video`);
  
      if (response.status === 200) {
        Alert.alert('Video Generado', 'El video del evento ha sido generado con éxito.');
      } else {
        throw new Error(`Failed to generate video, status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al generar el video:', error);
      Alert.alert('Error', 'No se pudo generar el video del evento.');
    }
  };

  const isButtonDisabled = () => {
    if (!endDate) return true; 
    const currentDate = new Date();
    return currentDate <= endDate; 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotos del Evento</Text>
      <Button title="Escoger Imagen" onPress={chooseImage} />

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
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <Text style={styles.tagsTitle}>Tags:</Text>
            {item.tags && item.tags.length > 0 ? (
              item.tags.map((tag) => (
                <Text key={tag.user_id} style={styles.tagHandle}>
                  {tag.handle}
                </Text>
              ))
            ) : (
              <Text style={styles.noTags}>No tags</Text>
            )}

            <Picker
              selectedValue={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un usuario" value="" />
              {users
                .filter((user) => {
                  const isTagged = item.tags.some((tag) => tag.user_id === user.id);
                  return !isTagged; 
                })
                .map((user) => (
                  <Picker.Item key={user.id} label={user.handle} value={user.id.toString()} />
                ))}
            </Picker>

            <Button title="Añadir Tag" onPress={() => addTagToPicture(item.id)} />
          </View>
        )}
      />

      <Button
        title="Generar Video"
        onPress={generateVideo}
        disabled={isButtonDisabled()}
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
  imageContainer: { marginBottom: 20 },
  tagsTitle: { fontSize: 14, fontWeight: 'bold' },
  tagHandle: { fontSize: 12, color: '#555' },
  noTags: { fontSize: 12, fontStyle: 'italic', color: '#999' },
  picker: { height: 50, width: '100%', marginTop: 10 },
});
