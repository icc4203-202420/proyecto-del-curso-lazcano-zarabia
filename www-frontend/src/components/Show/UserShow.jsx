import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

const UserShow = ({ userId }) => {
  const { id: friendId } = useParams(); // `id` es el ID del usuario a agregar como amigo (de la URL)
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false); // Estado para saber si ya son amigos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener los detalles del usuario
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:3001/api/v1/users/${friendId}`, {
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

    fetchUserDetails();
  }, [friendId]);

  // Función para enviar la solicitud de amistad
  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación
      const response = await fetch(`http://127.0.0.1:3001/api/v1/friendships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId, // Enviar el ID del usuario actualmente autenticado
          friend_id: friendId, // El ID del usuario al que se quiere agregar como amigo
        }),
      });

      if (response.ok) {
        setIsFriend(true); // Cambiar el estado para reflejar la amistad creada
      } else {
        const errorData = await response.json();
        console.error('Error al agregar como amigo:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  if (loading) return <Typography variant="h6">Cargando detalles del usuario...</Typography>;

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4">Perfil del Usuario</Typography>
      {user && <Typography variant="h6">Handle: {user.handle}</Typography>}
      <Button variant="contained" color="primary" onClick={handleAddFriend} disabled={isFriend}>
        {isFriend ? 'Amigos' : 'Agregar como amigo'}
      </Button>
    </div>
  );
};

export default UserShow;
