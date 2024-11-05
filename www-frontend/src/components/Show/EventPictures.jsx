import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, Card, CardMedia, Typography, Button } from '@mui/material';

const EventPictures = () => {
  const { id_event } = useParams();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventPictures = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/event_pictures`);
        const data = await response.json();
        setPictures(data.pictures || []);
      } catch (err) {
        console.error('Error al cargar las imágenes del evento:', err);
        setError('No se pudieron cargar las imágenes.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventPictures();
  }, [id_event]);

  if (loading) return <p>Cargando imágenes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Galería de Imágenes del Evento
      </Typography>
      <Grid container spacing={3}>
        {pictures.length > 0 ? (
          pictures
            .filter((picture) => picture.image_url !== null && picture.image_url.trim() !== "")
            .map((picture) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={picture.id}>
                <Card>
                  {/* Link para navegar a la página de la imagen individual */}
                  <Link to={`/events/${id_event}/pictures/${picture.id}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={picture.image_url}
                      alt={`Imagen del evento ${id_event}`}
                      style={{ cursor: 'pointer' }}  // Cambiar cursor para indicar que es clicable
                    />
                  </Link>
                </Card>
              </Grid>
            ))
        ) : (
          <Typography variant="h6">No hay imágenes disponibles.</Typography>
        )}
      </Grid>
      {/* Link para regresar al EventShow */}
      <Button
        component={Link}
        to={`/bars/${id_event}/events/${id_event}`}
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
      >
        Volver al Evento
      </Button>
    </div>
  );
};

export default EventPictures;
