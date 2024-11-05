import React, { useState } from 'react';
import { TextField, Container, Typography } from '@mui/material';

function UserSearch() {
  const [handle, setHandle] = useState(''); // Estado para almacenar el handle ingresado

  const handleInputChange = (event) => {
    setHandle(event.target.value); // Actualiza el estado con el valor ingresado
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Buscar Usuario
      </Typography>
      <TextField
        label="Handle del Usuario"
        variant="outlined"
        fullWidth
        value={handle}
        onChange={handleInputChange}
        placeholder="Escribe el handle del usuario"
        style={{ marginTop: '20px' }}
      />
      <Typography variant="body1" style={{ marginTop: '20px' }}>
        Buscando: {handle}
      </Typography>
    </Container>
  );
}

export default UserSearch;
