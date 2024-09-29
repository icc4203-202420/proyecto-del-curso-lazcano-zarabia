import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Autocomplete, TextField, Box } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { EditIcon } from '../common/icons'; // Importar el EditIcon desde el archivo correspondiente

const UserShow = ({ userId, events, bars }) => {
  const { id: friendId } = useParams();
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [friendship, setFriendship] = useState(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch para obtener la amistad específica entre userId y friendId
  useEffect(() => {
    const fetchFriendshipDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:3001/api/v1/users/${userId}/friendships/${friendId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la amistad');
        }
        const data = await response.json();
        setFriendship(data);
        setSelectedEvent(data.event_id ? events.find(event => event.id === data.event_id) : null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('No se pudieron obtener los detalles de la amistad');
        setLoading(false);
      }
    };

    fetchFriendshipDetails();
  }, [userId, friendId, events]);

  // Fetch data del amigo (user)
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

  // Verificar la amistad entre los dos usuarios
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
            user_id: userId,
            friend_id: friendId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsFriend(data.is_friend);
        } else {
          const errorData = await response.json();
          console.error('Error al verificar amistad:', errorData);
        }
      } catch (error) {
        console.error('Error de red al verificar amistad:', error);
      }
    };

    checkFriendshipStatus();
  }, [userId, friendId]);

  // Función para enviar la solicitud de amistad
  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:3001/api/v1/friendships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          friend_id: friendId,
        }),
      });

      if (response.ok) {
        setIsFriend(true);
      } else {
        const errorData = await response.json();
        console.error('Error al agregar como amigo:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Función para agregar el evento donde se conocieron después de hacerse amigos
  const handleAddEventToFriendship = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:3001/api/v1/friendships/add_event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          friend_id: friendId,
          event_id: selectedEvent ? selectedEvent.id : null,
        }),
      });

      if (response.ok) {
        console.log('Event added to friendship successfully.');
        setIsEditingEvent(false);
      } else {
        const errorData = await response.json();
        console.error('Error al agregar el evento a la amistad:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const getBarName = (barId) => {
    const bar = bars.find(bar => bar.id === barId);
    return bar ? bar.name : 'Unknown Bar';
  };

  if (loading) return <Typography variant="h6">Cargando detalles del usuario...</Typography>;

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4">Perfil del Usuario</Typography>

      <Box display="flex" alignItems="center" marginBottom={2}>
        {user && (
          <Typography variant="h6" style={{ marginRight: 16 }}>
            Handle: {user.handle}
          </Typography>
        )}

        <Button
          variant="contained"
          color={isFriend ? 'default' : 'primary'}
          onClick={handleAddFriend}
          startIcon={<PersonAddIcon />}
          disabled={isFriend}
        >
          {isFriend ? 'Friends' : 'Add Friend'}
        </Button>
      </Box>

      {isFriend && friendship && friendship.event_id && !isEditingEvent && (
        <Box display="flex" alignItems="center" marginBottom={2}>
          <Typography variant="h6" gutterBottom style={{ marginRight: 16 }}>
            Se conocieron en el evento: {selectedEvent ? selectedEvent.name : 'Desconocido'} en el bar {getBarName(selectedEvent ? selectedEvent.bar_id : null)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsEditingEvent(true)}
            sx={{
              bgcolor: '#FFD700', 
              color: 'black',
              '&:hover': { bgcolor: '#FFC107' }, 
            }}
          >
            {<EditIcon/>}
          </Button>
        </Box>
      )}

      {isFriend && isEditingEvent && (
        <div>
          <Typography variant="h6" gutterBottom>
            {selectedEvent ? 'Cambiar el evento donde se conocieron:' : 'Seleccionar el evento donde se conocieron:'}
          </Typography>
          <Autocomplete
            disablePortal
            options={events}
            getOptionLabel={(option) => `${option.name} - ${getBarName(option.bar_id)}`}
            sx={{ width: 300, marginBottom: 2 }}
            value={selectedEvent}
            onChange={(event, newValue) => setSelectedEvent(newValue)}
            renderInput={(params) => <TextField {...params} label="Evento donde se conocieron" />}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddEventToFriendship}
            disabled={!selectedEvent}
          >
            {selectedEvent ? 'Cambiar Evento' : 'Agregar Evento'}
          </Button>
          <Button variant="outlined" color="default" onClick={() => setIsEditingEvent(false)} style={{ marginLeft: 8 }}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserShow;
