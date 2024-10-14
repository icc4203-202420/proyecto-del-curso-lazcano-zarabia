import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'qs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation'; 

// Definir los tipos de los valores del formulario
interface RegisterFormValues {
  first_name: string;
  last_name: string;
  handle: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Validaciones de Yup
const validationSchema = Yup.object({
  first_name: Yup.string().required('El nombre es requerido'),
  last_name: Yup.string().required('El apellido es requerido'),
  handle: Yup.string().required('El handle es requerido'),
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Las contraseñas no coinciden')  // Cambia null a undefined
    .required('Repetir la contraseña es requerido'),
});

// Valores iniciales
const initialValues: RegisterFormValues = {
  first_name: '',
  last_name: '',
  handle: '',
  email: '',
  password: '',
  password_confirmation: '',
};

// Configuración de axios con axios-hooks
axios.defaults.baseURL = 'http://127.0.0.1:3001/api/v1';

const RegistrationForm = () => {
  const [serverError, setServerError] = useState(''); 

  // Definir el tipo de la navegación correctamente
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'register'>;
  const navigation = useNavigation<NavigationProp>();

  // Definir el hook para la petición POST
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    { manual: true }
  );

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: any) => {
    try {
      const response = await executePost({ data: qs.stringify({ user: values }) });
      setServerError('');
      navigation.navigate('login');  // Redirigir a la pantalla de login
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setServerError('Correo electrónico ya registrado.');
      } else {
        setServerError('Error en el servidor. Intenta nuevamente más tarde.');
      }
      console.error('Error en el envío del formulario:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear una cuenta</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, isSubmitting, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              onChangeText={handleChange('first_name')}
              value={values.first_name}
              autoCapitalize="none"
            />
            {touched.first_name && errors.first_name && <Text style={styles.error}>{errors.first_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              onChangeText={handleChange('last_name')}
              value={values.last_name}
              autoCapitalize="none"
            />
            {touched.last_name && errors.last_name && <Text style={styles.error}>{errors.last_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Handle"
              onChangeText={handleChange('handle')}
              value={values.handle}
              autoCapitalize="none"
            />
            {touched.handle && errors.handle && <Text style={styles.error}>{errors.handle}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              onChangeText={handleChange('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Repetir contraseña"
              onChangeText={handleChange('password_confirmation')}
              value={values.password_confirmation}
              secureTextEntry
            />
            {touched.password_confirmation && errors.password_confirmation && <Text style={styles.error}>{errors.password_confirmation}</Text>}

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button onPress={handleSubmit as any} title="Registrarse" disabled={isSubmitting} />
            )}

            {serverError && <Text style={styles.error}>{serverError}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  form: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegistrationForm;
