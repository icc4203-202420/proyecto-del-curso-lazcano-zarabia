import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BarShow = ({ bars }) => {
  const { id } = useParams(); 
  const bar = bars.find((bar) => bar.id === parseInt(id)); 

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id}/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const result = await response.json();
        setEvents(result);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  if (!bar) {
    return <p>Bar no encontrado</p>; 
  }

  if (isLoading) {
    return <p>Cargando eventos...</p>;
  }

  if (isError) {
    return <p>Error al cargar los eventos</p>;
  }

  return (
    <div>
      <h1>{bar.name}</h1>

      <h2>Eventos</h2>
      <ul>
        {events.length ? (
          events.map((event) => (
            <li key={event.id}>
              <Link to={`/events/${event.id}`}>{event.name}</Link>
            </li>
          ))
        ) : (
          <p>No hay eventos disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default BarShow;
