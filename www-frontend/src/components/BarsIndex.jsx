import React from 'react';
import { Typography, Container } from '@mui/material';

function BarsIndex() {
  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Búsqueda de bares
      </Typography>
      <Typography variant="body1">
        Aquí podrás buscar y listar bares.
      </Typography>
    </Container>
  );
}

export default BarsIndex;
