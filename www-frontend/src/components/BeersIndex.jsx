import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Container, Typography } from '@mui/material';

function BeersIndex() {
  const [beers, setBeers] = useState([]); // Estado para almacenar las cervezas
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  const fetchBeers = async () => {
    try {
      const response = await fetch('/api/v1/beers.json');
      const data = await response.json();
      setBeers(data.beers || []); // Asegúrate de que el estado se actualice correctamente
    } catch (error) {
      console.error('Error fetching beers:', error);
      setBeers([]); // En caso de error, asegúrate de que el estado sea un array vacío
    }
  };

  useEffect(() => {
    fetchBeers();
  }, []); // Este efecto solo debe ejecutarse una vez

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Cervezas
      </Typography>
      <TextField
        label="Buscar Cervezas"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Escribe el nombre de la cerveza"
        style={{ marginBottom: '20px' }}
      />
      <List>
        {filteredBeers.length > 0 ? (
          filteredBeers.map(beer => (
            <ListItem key={beer.id}>
              <ListItemText
                primary={beer.name}
                secondary={beer.description || 'Sin descripción'}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">
            No se encontraron cervezas que coincidan con la búsqueda.
          </Typography>
        )}
      </List>
    </Container>
  );
}

export default BeersIndex;




