import React, { useEffect, useRef } from 'react';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY } from '../constants';  // Asegúrate de tener esta constante definida en tus constantes

const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };

const Home = () => {
  const libraries = useLoadGMapsLibraries();
  const mapNodeRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    if (!libraries) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];  // Accedemos al objeto Map de Google Maps

    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 7,
    });
  }, [libraries]);

  if (!libraries) {
    return <h1>Cargando mapa...</h1>;
  }

  return (
    <div>
      <h1>Mapa de Ciudades</h1>
      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default Home;
