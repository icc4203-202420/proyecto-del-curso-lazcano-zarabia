import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'qs';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types/navigation'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir los tipos de los valores del formulario
interface LoginFormValues {
  email: string;
  password: string;
}

// Definir el tipo para las props, incluyendo tokenHandler
type Props = {
  tokenHandler: (token: string) => void;  // Definir el tipo de tokenHandler
  navigation: any;
};

const validationSchema = Yup.object({
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

axios.defaults.baseURL = 'http://127.0.0.1:3001/api/v1'; 

const LoginScreen = ({ tokenHandler }: Props) => {
  const [serverError, setServerError] = useState(''); 
  const navigation = useNavigation<Props['navigation']>(); 

  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
    { manual: true }
  );

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
    try {
      const response = await executePost({ data: qs.stringify({ user: values }) });
      console.log("Response: ", response);

      const receivedToken = response.headers.authorization.split(' ')[1];

      if (receivedToken) {
        tokenHandler(receivedToken);  
        setServerError(''); 
        navigation.navigate('index'); 
      } else {
        setServerError('No token received. Please try again.');
      }
    } catch (err: any) {
      console.error('Full error: ', err);
      if (err.response && err.response.status === 401) {
        setServerError('Correo electrónico o contraseña incorrectos.');
      } else {
        setServerError('Error en el servidor. Intenta nuevamente más tarde.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, isSubmitting, errors, touched }) => (
          <View style={styles.form}>
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

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button onPress={handleSubmit as any} title="Iniciar Sesión" disabled={isSubmitting} />
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

export default LoginScreen;
