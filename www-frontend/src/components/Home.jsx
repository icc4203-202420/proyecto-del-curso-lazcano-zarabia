import React, { useEffect, useRef } from 'react';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY, ControlPosition } from '../constants';
import { MarkerClusterer } from '@googlemaps/markerclusterer';


const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };

const Home = ( { cities, filteredCities }) => {
  const libraries = useLoadGMapsLibraries();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const markerCluster = useRef();

  useEffect(() => {
    if (!libraries) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];  // Accedemos al objeto Map de Google Maps

    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 2,
    });
  }, [libraries]);


  //ajustar los limites del mapa
  useEffect(() => {
    if (!libraries || !mapRef.current) return;

    if (filteredCities.length === 0) return; // Evita errores si no hay ciudades

    const bounds = new google.maps.LatLngBounds();
    filteredCities.forEach((city) => bounds.extend(city.position));
    mapRef.current.fitBounds(bounds);
  }, [libraries, filteredCities]);

  const generateMarkers = (cities, Marker, PinElement, InfoWindow) => {
    return cities.map(({ name, position }) => {
      const pin = new PinElement();
      pin.glyph = `${name} ${position.lat.toFixed(2)}, ${position.lng.toFixed(2)}`;
      pin.glyphColor = '#ffffff';
      pin.background = '#000000';
      pin.borderColor = '#000000';

      const marker = new Marker({ position, content: pin.element });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        const infoWindow = new InfoWindow({
          content: `<div><h4>Marker at ${position.lat.toFixed(2)}, ${position.lng.toFixed(2)}</h4></div>`,
          position,
        });
        infoWindow.open(mapRef.current, marker);
        infoWindowRef.current = infoWindow;
      });

      return marker;
    });
  };

  useEffect(() => {
    if (!libraries || !mapRef.current) {
      return;
    }
  
    const { AdvancedMarkerElement: Marker, PinElement } = libraries[MARKER_LIBRARY];
    const { InfoWindow } = libraries[MAPS_LIBRARY];
  
    // Eliminar los marcadores existentes del clúster antes de crear nuevos.
    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
    }
  
    // Crear y añadir los nuevos marcadores filtrados.
    const markers = generateMarkers(filteredCities, Marker, PinElement, InfoWindow);
    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [filteredCities, libraries]);

  useEffect(() => {
    if (!libraries || !mapRef.current) {
      return;
    }

    const { AdvancedMarkerElement: Marker, PinElement } = libraries[MARKER_LIBRARY];
    const { InfoWindow } = libraries[MAPS_LIBRARY];

    // Limpia los marcadores existentes
    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
    }

    // Genera los nuevos marcadores
    const markers = generateMarkers(filteredCities, Marker, PinElement, InfoWindow);

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [filteredCities, libraries]);
  

  if (!libraries) {
    return <h1>Cargando mapa...</h1>;
  }

  return (
    <div>
      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default Home;
