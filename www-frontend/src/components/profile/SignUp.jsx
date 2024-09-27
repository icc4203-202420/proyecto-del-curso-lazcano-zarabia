import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  first_name: Yup.string().required('El nombre es requerido'),
  last_name: Yup.string().required('El apellido es requerido'),
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Repetir la contraseña es requerido'),
});

const initialValues = {
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
  const [serverError, setServerError] = useState(''); // Estado para manejar el error del servidor
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Definir el hook para la petición POST
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    { manual: true } // No ejecutar automáticamente, lo haremos manualmente al enviar el formulario
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await executePost({ 
        data: qs.stringify({user: values}) 
    });
      setServerError(''); // Limpia el mensaje de error si el registro es exitoso
      navigate('/'); // Redirige a la ruta después de un registro exitoso
    } catch (err) {
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
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Crear una cuenta
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              
                <Box sx={{ mt: 2 }}>
                <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    label="Name"
                    name="first_name"
                    type="text"
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                    margin="normal"
                />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Field
                        as={TextField}
                        fullWidth
                        variant="outlined"
                        label="Last Name"
                        name="last_name"  // Debe coincidir con la clave en initialValues
                        type="text"
                        error={touched.last_name && Boolean(errors.last_name)}
                        helperText={touched.last_name && errors.last_name}
                        margin="normal"
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Field
                        as={TextField}
                        fullWidth
                        variant="outlined"
                        label="Handle"
                        name="handle"
                        type="text"
                        error={touched.handle && Boolean(errors.handle)}
                        helperText={touched.handle && errors.handle}
                        margin="normal"
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    margin="normal"
                />
                </Box>
                <Box sx={{ mt: 2 }}>
                <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    label="Contraseña"
                    name="password"
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    margin="normal"
                />
                </Box>
                <Box sx={{ mt: 2 }}>
                <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    label="Repetir contraseña"
                    name="password_confirmation"
                    type="password"
                    error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                    helperText={touched.password_confirmation && errors.password_confirmation}
                    margin="normal"
                />
                </Box>
                <Box sx={{ mt: 3 }}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || loading}
                >
                    {loading ? 'Enviando...' : 'Registrarse'}
                </Button>
                </Box>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
