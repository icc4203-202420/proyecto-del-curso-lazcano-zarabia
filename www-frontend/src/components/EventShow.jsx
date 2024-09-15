import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventShow = () => {
  const { id_bar, id_event } = useParams();
  const [event, setEvent] = useState(null);
  const [bar, setBar] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventBarAndAddress = async () => {
      try {
        // Obtener el evento
        const eventResponse = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id_bar}/events/${id_event}`);
        const eventData = await eventResponse.json();

        if (Array.isArray(eventData) && eventData.length > 0) {
          setEvent(eventData[0]);
        } else if (!Array.isArray(eventData)) {
          setEvent(eventData);
        } else {
          throw new Error('Evento no encontrado');
        }

        // Obtener el bar
        const barResponse = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id_bar}`);
        const barData = await barResponse.json();
        const bar = barData.bar || barData;
        setBar(bar);

        // Obtener la dirección usando el address_id del bar
        const addressResponse = await fetch(`http://127.0.0.1:3001/api/v1/addresses/${bar.address_id}`);
        const addressData = await addressResponse.json();
        setAddress(addressData);
        
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

  if (!event || !bar || !address) {
    return <p>No se encontraron datos.</p>;
  }

  return (
    <div>
      <h1>Evento: {event.name}</h1>
      <p>{event.description}</p>
      <p>Fecha: {event.date}</p>
      <h2>Bar: {bar.name}</h2>
      <p>Dirección: {address.line1}, {address.line2 ? address.line2 + ',' : ''} {address.city}</p>
    </div>
  );
};

export default EventShow;
