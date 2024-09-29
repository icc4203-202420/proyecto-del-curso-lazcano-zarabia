import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // Importar Yup para la validación

const EventShow = ({userId}) => {
  const { id_bar, id_event } = useParams();
  const [event, setEvent] = useState(null);
  const [bar, setBar] = useState(null);
  const [address, setAddress] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventBarAndAddress = async () => {
      try {
        const eventResponse = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id_bar}/events/${id_event}`);
        const eventData = await eventResponse.json();
        setEvent(Array.isArray(eventData) ? eventData[0] : eventData);

        const barResponse = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id_bar}`);
        const barData = await barResponse.json();
        const bar = barData.bar || barData;
        setBar(bar);

        const addressResponse = await fetch(`http://127.0.0.1:3001/api/v1/addresses/${bar.address_id}`);
        const addressData = await addressResponse.json();
        setAddress(addressData);

        const attendancesResponse = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/attendances`);
        const attendancesData = await attendancesResponse.json();
        setAttendances(attendancesData);

        const usersResponse = await fetch('http://127.0.0.1:3001/api/v1/users');
        const usersData = await usersResponse.json();
        setAllUsers(usersData.users);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventBarAndAddress();
  }, [id_bar, id_event]);

  // Manejo del formulario de asistencia
  const handleAddAttendance = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUserId,
          event_id: id_event,
        }),
      });
      if (response.ok) {
        const newAttendance = await response.json();
        setAttendances([...attendances, newAttendance]);
      } else {
        console.error('Error al agregar el asistente.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleImageUpload = async (values, { setSubmitting }) => {
    const formData = new FormData();
    Array.from(values.flyers).forEach((file) => {
      formData.append('flyers[]', file);
    });
    
    // Incluir el `user_id` en el FormData
    formData.append('user_id', userId);
  
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/add_images`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('Imágenes subidas correctamente');
      } else {
        console.error('Error al subir las imágenes');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  

  const availableUsers = allUsers.filter(
    (user) => !attendances.some((attendance) => attendance.user_id === user.id)
  );

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        {/* Título del evento */}
        <Typography variant="h4" component="h1">
          Evento: {event.name}
        </Typography>
        
        {/* Botón para ver la galería */}
        <Button
          component={Link}
          to={`/events/${id_event}/pictures`}
          variant="contained"
          color="secondary"
          style={{ marginLeft: '20px' }}  // Espacio entre el título y el botón
        >
          Ver Galería de Imágenes
        </Button>
      </Box>
      
      <p>{event.description}</p>
      <p>Fecha: {event.date}</p>
      <h2>Bar: {bar.name}</h2>
      <p>Dirección: {address.line1}, {address.line2 ? address.line2 + ',' : ''} {address.city}</p>
      
      {/* Formulario para subir imágenes sin validación */}
      <Formik
        initialValues={{ flyers: [] }}
        onSubmit={handleImageUpload}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <input
                id="flyers"
                name="flyers"
                type="file"
                multiple
                onChange={(event) => setFieldValue("flyers", event.currentTarget.files)}
                style={{ marginBottom: '20px' }}
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Subiendo...' : 'Subir Imágenes'}
            </Button>
          </Form>
        )}
      </Formik>


      <h3>Asistentes:</h3>
      <ul>
        {attendances.length > 0 ? (
          attendances.map((attendance) => {
            const user = allUsers.find(user => user.id === attendance.user_id);
            return (
              <li key={attendance.user_id}>
                {user ? `@${user.handle}` : `Usuario ID: ${attendance.user_id}`} 
              </li>
            );
          })
        ) : (
          <p>No hay asistentes confirmados.</p>
        )}
      </ul>

      {/* Formulario para agregar asistente */}
      <form onSubmit={handleAddAttendance}>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel id="user-select-label">Seleccionar usuario</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            {availableUsers.length > 0 ? (
              availableUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} (@{user.handle})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay más usuarios disponibles</MenuItem>
            )}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Agregar Asistente
        </Button>
      </form>
    </div>
  );
};

export default EventShow;
