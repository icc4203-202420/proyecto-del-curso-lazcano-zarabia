import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container } from '@mui/material';

function BarEvents() {
  const { id } = useParams(); 

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Eventos en el Bar {id}
      </Typography>
      <Typography variant="body1">
        Aquí se listarán los eventos del bar con ID: {id}.
      </Typography>
    </Container>
  );
}

export default BarEvents;
