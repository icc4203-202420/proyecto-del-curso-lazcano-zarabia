import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Button, Box } from '@mui/material';

const EventPictureShow = () => {
  const { id_event, id_picture } = useParams();  // Obtener `id_event` e `id_picture` desde la URL
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchPicture();
  }, [id_event, id_picture]);

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
      {/* Link para regresar a la galería de imágenes */}
      <Button
        component={Link}
        to={`/events/${id_event}/pictures`}
        variant="contained"
        color="primary"
      >
        Volver a la Galería de Imágenes
      </Button>
    </Box>
  );
};

export default EventPictureShow;
