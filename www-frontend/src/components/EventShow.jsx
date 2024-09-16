import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventShow = () => {
  const { id_bar, id_event } = useParams();
  const [event, setEvent] = useState(null);
  const [bar, setBar] = useState(null);
  const [address, setAddress] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventBarAndAddress = async () => {
      try {
        // Obtener el evento
        const eventResponse = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id_bar}/events/${id_event}`);
        const eventData = await eventResponse.json();
        setEvent(Array.isArray(eventData) ? eventData[0] : eventData);

        // Obtener el bar
        const barResponse = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id_bar}`);
        const barData = await barResponse.json();
        const bar = barData.bar || barData;
        setBar(bar);

        // Obtener la dirección usando el address_id del bar
        const addressResponse = await fetch(`http://127.0.0.1:3001/api/v1/addresses/${bar.address_id}`);
        const addressData = await addressResponse.json();
        setAddress(addressData);

        // Obtener las asistencias para el evento
        const attendancesResponse = await fetch(`http://127.0.0.1:3001/api/v1/events/${id_event}/attendances`);
        const attendancesData = await attendancesResponse.json();
        setAttendances(attendancesData);

        // Para cada asistencia, obtener el usuario asociado
        const usersData = {};
        for (const attendance of attendancesData) {
          const userResponse = await fetch(`http://127.0.0.1:3001/api/v1/users/${attendance.user_id}`);
          const userData = await userResponse.json();
          usersData[attendance.user_id] = userData; // Guardamos el usuario con su ID
        }
        setUsers(usersData);
        
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventBarAndAddress();
  }, [id_bar, id_event]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!event || !bar || !address || !attendances.length) {
    return <p>No se encontraron datos.</p>;
  }

  return (
    <div>
      <h1>Evento: {event.name}</h1>
      <p>{event.description}</p>
      <p>Fecha: {event.date}</p>
      <h2>Bar: {bar.name}</h2>
      <p>Dirección: {address.line1}, {address.line2 ? address.line2 + ',' : ''} {address.city}</p>
      
      <h3>Asistentes:</h3>
      <ul>
        {attendances.length > 0 ? (
          attendances.map((attendance) => {
            const user = users[attendance.user_id];
            return (
              <li key={attendance.user_id}>
                {user ? `@${user.handle}` : `Usuario ID: ${attendance.user_id}`} 
              </li>
            );
          })
        ) : (
          <p>No hay asistentes confirmados.</p>
        )}
      </ul>
    </div>
  );
};

export default EventShow;
