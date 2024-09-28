import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { Typography, Box } from '@mui/material';

const UserShow = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch(`http://127.0.0.1:3001/api/v1/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del usuario');
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('No se pudieron obtener los detalles del usuario');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); 

  if (loading) return <Typography variant="h6">Cargando detalles del usuario...</Typography>;

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4">User profile  @{user.handle}</Typography>
      <Typography variant="body1">Nombre: {user.first_name} {user.last_name}</Typography>
    </Box>
  );
};

export default UserShow;
