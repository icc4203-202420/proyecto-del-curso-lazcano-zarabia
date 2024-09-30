import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = ({ isAuthenticated, handleLogout }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtiene el token y user_id de localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    // Verifica si hay un token y un user_id para hacer la solicitud
    if (token && userId) {
      fetchUserDetails(userId, token);
    }
  }, []);

  // Función para obtener los detalles del usuario desde la API
  const fetchUserDetails = (userId, token) => {
    fetch(`http://127.0.0.1:3001/api/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en la cabecera
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del usuario');
        }
        return response.json();
      })
      .then((data) => {
        setUserDetails(data); // Guarda los datos del usuario en el estado
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron obtener los detalles del usuario');
        setLoading(false);
      });
  };

  // Mostrar un mensaje de carga mientras se obtiene la información
  if (loading) return <p>Cargando perfil...</p>;

  // Mostrar un mensaje de error si hubo algún problema
  if (error) return <p>{error}</p>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Perfil del usuario</h1>
          {/* Muestra el nombre y otros detalles del usuario obtenidos */}
          <p>Name: {userDetails?.first_name} {userDetails?.last_name}</p>
          <p>@{userDetails?.handle}</p>
          <p>Email: {userDetails?.email}</p>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleLogout(); // Llama a la función handleLogout pasada como prop
              navigate('/login'); // Redirige al usuario a la página de login
            }}
          >
            Cerrar Sesión
          </Button>
        </>
      ) : (
        <h1>No has iniciado sesión</h1>
      )}
    </div>
  );
};

export default Profile;
