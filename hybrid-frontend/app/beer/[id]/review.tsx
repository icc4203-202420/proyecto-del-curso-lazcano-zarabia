import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';

export default function ReviewBeer() {
  const { id } = useLocalSearchParams();  // Recibimos el ID de la cerveza
  const router = useRouter();

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3.0); // Valor inicial del rating
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    const wordCount = reviewText.trim().split(/\s+/).length; // Contamos las palabras

    // Validación de las condiciones
    if (wordCount < 15) {
      setErrorMessage('La evaluación debe tener al menos 15 palabras.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('El rating debe estar entre 1 y 5.');
      return;
    }

    // Si pasa las validaciones, enviamos la evaluación
    try {
      const newReview = {
        text: reviewText,
        rating: rating,
        beer_id: id,
        // Puedes agregar un campo user_id si es necesario.
      };

      const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'La evaluación ha sido enviada con éxito');
        router.push(`/beer/${id}`);
      } else {
        Alert.alert('Error', 'Error al enviar la evaluación');
      }
    } catch (error) {
      setErrorMessage('Hubo un error enviando la evaluación.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribir evaluación para la Cerveza</Text>

      <Text style={styles.label}>Escribe tu evaluación:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Escribe una evaluación (al menos 15 palabras)"
      />

      <Text style={styles.label}>Rating: {rating.toFixed(1)}</Text>
      {Platform.OS !== 'web' && (
        <Slider
            value={rating}
            onValueChange={setRating}
            minimumValue={1}
            maximumValue={5}
            step={0.1}
        />
    )}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button title="Enviar Evaluación" onPress={handleSubmit} />
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
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});
