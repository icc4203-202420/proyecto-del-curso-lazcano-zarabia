import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Autocomplete, TextField, Box } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserShow = ({ userId, bars }) => {
  const { id: friendId } = useParams(); // `id` es el ID del usuario a agregar como amigo (de la URL)
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false); // Estado para saber si ya son amigos
  const [selectedBar, setSelectedBar] = useState(null); // Estado para el bar seleccionado
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

  // Función para verificar si son amigos al cargar el componente
  useEffect(() => {
    const checkFriendshipStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:3001/api/v1/friendships/check_friendship`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId, // ID del usuario autenticado
            friend_id: friendId, // ID del usuario a verificar
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsFriend(data.is_friend); // Actualiza `isFriend` basado en la respuesta
        } else {
          const errorData = await response.json();
          console.error('Error al verificar amistad:', errorData);
        }
      } catch (error) {
        console.error('Error de red al verificar amistad:', error);
      }
    };

    checkFriendshipStatus(); // Llamar a la función para verificar la amistad al cargar el componente
  }, [userId, friendId]);

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

  // Función para agregar el bar donde se conocieron después de hacerse amigos
  const handleAddBarToFriendship = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:3001/api/v1/friendships/add_bar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId, // ID del usuario autenticado
          friend_id: friendId, // ID del amigo
          bar_id: selectedBar ? selectedBar.id : null, // ID del bar seleccionado
        }),
      });

      if (response.ok) {
        console.log('Bar added to friendship successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error al agregar el bar a la amistad:', errorData);
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

      {/* Contenedor para el handle del usuario y el botón "Add Friend" */}
      <Box display="flex" alignItems="center" marginBottom={2}>
        {user && (
          <Typography variant="h6" style={{ marginRight: 16 }}>
            Handle: {user.handle}
          </Typography>
        )}
        {/* Botón "Add Friend" */}
        <Button
          variant="contained"
          color={isFriend ? 'default' : 'primary'}
          onClick={handleAddFriend}
          startIcon={<PersonAddIcon />}
          disabled={isFriend} // Deshabilitado si ya son amigos
        >
          {isFriend ? 'Friends' : 'Add Friend'}
        </Button>
      </Box>

      {/* Mostrar el Autocomplete para agregar el bar solo si ya son amigos */}
      {isFriend && (
        <div>
          <Typography variant="h6" gutterBottom>
            {selectedBar ? 'Cambiar el bar donde se conocieron:' : 'Seleccionar el bar donde se conocieron:'}
          </Typography>
          <Autocomplete
            disablePortal
            options={bars} // Usar la lista de bares pasada como prop
            getOptionLabel={(option) => option.name} // Mostrar el nombre del bar en el dropdown
            sx={{ width: 300, marginBottom: 2 }}
            value={selectedBar} // Establecer el valor inicial como `selectedBar`
            onChange={(event, newValue) => setSelectedBar(newValue)} // Actualizar el bar seleccionado
            renderInput={(params) => <TextField {...params} label="Bar donde se conocieron" />}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddBarToFriendship}
            disabled={!selectedBar} // Deshabilitar si no se ha seleccionado un bar
          >
            {selectedBar ? 'Cambiar Bar' : 'Agregar Bar'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserShow;
