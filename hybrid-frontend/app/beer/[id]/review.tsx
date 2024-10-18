import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Slider } from '@rneui/themed'; 
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message'; // Importa el componente Toast

export default function ReviewBeer() {
  const { id } = useLocalSearchParams();  
  const router = useRouter();

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3.0);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/v1/users');
        const result = await response.json();
        setUsers(result.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    async function fetchReviews() {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`);
        const result = await response.json();
        setReviews(result); 
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    fetchUsers();
    fetchReviews(); 
  }, [id]);

  const handleSubmit = async () => {
    if (reviewText.split(' ').length < 15) {
      setErrorMessage('La evaluación debe tener al menos 15 palabras.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('El rating debe estar entre 1 y 5.');
      return;
    }

    if (!selectedUser) {
      setErrorMessage('Debes seleccionar un usuario.');
      return;
    }

    const newReview = {
      text: reviewText,
      rating: rating,
      user_id: selectedUser,
      beer_id: id,
    };

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const createdReview = await response.json();
        setReviews([...reviews, createdReview]);
        setReviewText('');
        setRating(3.0);
        setSelectedUser('');

        // Muestra el toast de éxito
        Toast.show({
          type: 'success',
          text1: 'Éxito',
          text2: 'La evaluación ha sido enviada con éxito 👏',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error al enviar la evaluación 😢',
        });
      }
    } catch (error) {
      setErrorMessage('Hubo un error enviando la evaluación.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribir evaluación para la Cerveza</Text>

      <Text style={styles.label}>Selecciona un usuario:</Text>
      <Picker
        selectedValue={selectedUser}
        onValueChange={(itemValue) => setSelectedUser(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar usuario" value="" />
        {users.map((user) => (
          <Picker.Item key={user.id} label={user.handle} value={user.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Escribe una evaluación (al menos 15 palabras)"
      />

      <Text style={styles.label}>Rating: {rating.toFixed(1)}</Text>
      <Slider
        value={rating}
        onValueChange={setRating}
        maximumValue={5}
        minimumValue={1}
        step={0.1}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="star"
              type="font-awesome"
              size={20}
              reverse
              containerStyle={{ bottom: 20, right: 20 }}
              color="#f50"
            />
          ),
        }}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button title="Enviar Evaluación" onPress={handleSubmit} />

      <Text style={styles.label}>Reseñas existentes:</Text>
      {reviews.length === 0 ? (
        <Text>No hay reseñas para esta cerveza.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewText}>
                Usuario: {users.find((user) => user.id === item.user_id)?.handle || 'Desconocido'}
              </Text>
              <Text style={styles.reviewText}>Rating: {item.rating}</Text>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
        />
      )}

      {/* Agrega el componente Toast */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  reviewItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
  },
});
