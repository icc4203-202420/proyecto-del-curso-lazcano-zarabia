import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email no válido').required('Requerido'),
  password: Yup.string().required('Requerido'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: values.email,
            password: values.password,
          }
        }),
      });

      const data = await response.json();
      console.log(data);  // Debugging
      console.log(data.status.data.token);  // Debugging TOKEN

      if (response.ok) {
        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem('token', data.status.data.token);
        Alert.alert('Login exitoso');
        router.push('/'); // Redirigir al home
      } else {
        Alert.alert('Error en el login', data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error en el login', 'Ocurrió un error inesperado');
    }
    setLoading(false);
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {errors.email && touched.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {errors.password && touched.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button onPress={handleSubmit} title="Login" />
          )}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
