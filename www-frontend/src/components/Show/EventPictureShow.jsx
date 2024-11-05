import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Button, Box, Autocomplete, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const EventPictureShow = ({ users }) => {
  const { id_event, id_picture } = useParams();  // Obtener `id_event` e `id_picture` desde la URL
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tags, setTags] = useState([]);  // Estado para almacenar las personas etiquetadas

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        // Llamar a la nueva ruta `display_picture` en el backend
        const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/event_pictures/${id_picture}`);
        const data = await response.json();
        setPicture(data);  // Asignar la imagen recibida a `picture`
      } catch (err) {
        console.error('Error al cargar la imagen:', err);
        setError('No se pudo cargar la imagen.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/event_pictures/${id_picture}/tags`);
        const tagData = await response.json();
        setTags(tagData.tags || []);
      } catch (err) {
        console.error('Error al cargar las etiquetas:', err);
      }
    };

    fetchPicture();
    fetchTags();
  }, [id_event, id_picture]);

  // Manejar el evento de agregar una etiqueta a la imagen
  const handleAddTag = async () => {
    if (!selectedUser) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/event_pictures/${id_picture}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: selectedUser.id }),
      });
  
      if (response.ok) {
        // Crear una nueva etiqueta utilizando la información del `selectedUser`
        const newTag = { user_id: selectedUser.id, handle: selectedUser.handle };
        
        setTags([...tags, newTag]);  // Actualizar la lista de etiquetas con la nueva etiqueta
        setSelectedUser(null);  // Limpiar la selección de usuario después de agregar la etiqueta
      } else {
        console.error('Error al agregar la etiqueta.');
      }
    } catch (err) {
      console.error('Error al agregar la etiqueta:', err);
    }
  };
  

  // Manejar el evento de eliminar una etiqueta de la imagen
  const handleRemoveTag = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/event_pictures/${id_picture}/tags/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTags(tags.filter(tag => tag.user_id !== userId));  // Eliminar la etiqueta de la lista
      } else {
        console.error('Error al eliminar la etiqueta.');
      }
    } catch (err) {
      console.error('Error al eliminar la etiqueta:', err);
    }
  };

  // Filtrar los usuarios disponibles para etiquetar, excluyendo a los ya etiquetados
  const availableUsers = users.filter(
    (user) => !tags.some((tag) => tag.user_id === user.id)
  );

  if (loading) return <p>Cargando imagen...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={4}>
      <Typography variant="h4" gutterBottom>
        Imagen del Evento {id_event}
      </Typography>
      {picture && picture.image_url ? (
        <Card style={{ maxWidth: '800px', marginBottom: '20px' }}>
          <CardMedia
            component="img"
            image={picture.image_url}
            alt={`Imagen del evento ${id_event}`}
            style={{ width: '100%', height: 'auto' }}
          />
        </Card>
      ) : (
        <Typography variant="h6">No se encontró la imagen.</Typography>
      )}

      {/* Campo de autocompletado para seleccionar usuarios */}
      <Autocomplete
        disablePortal
        options={availableUsers}  // Usar la lista de usuarios disponibles
        getOptionLabel={(user) => `@${user.handle}`}
        sx={{ width: 300, marginBottom: '20px' }}
        onChange={(event, newValue) => setSelectedUser(newValue)}  // Establecer el usuario seleccionado
        renderInput={(params) => <TextField {...params} label="Etiquetar a un usuario" />}
        value={selectedUser}
      />
      <Button variant="contained" color="primary" onClick={handleAddTag} disabled={!selectedUser}>
        Agregar Etiqueta
      </Button>

      {/* Mostrar las etiquetas debajo de la imagen */}
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Usuarios etiquetados:
      </Typography>
      <List>
        {tags.map((tag, index) => (
          <ListItem 
            key={tag.user_id || index} // Asegúrate de usar `user_id` o `index` como respaldo si `user_id` es undefined
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTag(tag.user_id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`@${tag.handle || 'undefined'}`} /> {/* Mostrar `undefined` temporalmente si `tag.handle` es undefined */}
          </ListItem>
        ))}
      </List>


      {/* Link para regresar a la galería de imágenes */}
      <Button
        component={Link}
        to={`/events/${id_event}/pictures`}
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
      >
        Volver a la Galería de Imágenes
      </Button>
    </Box>
  );
};

export default EventPictureShow;
