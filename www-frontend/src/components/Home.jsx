import React, { useEffect, useRef, useState } from 'react';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY, ControlPosition } from '../constants';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };

const Home = () => {
  const libraries = useLoadGMapsLibraries();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const markerCluster = useRef();
  const infoWindowRef = useRef();
  
  const [bars, setBars] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);

  // Fetch los datos de los bares y las direcciones
  useEffect(() => {
    const fetchBarsAndAddresses = async () => {
      // Fetch bares
      const barsResponse = await fetch('http://127.0.0.1:3001/api/v1/bars');
      const barsData = await barsResponse.json();

      // Fetch direcciones
      const addressesResponse = await fetch('http://127.0.0.1:3001/api/v1/addresses');
      const addressesData = await addressesResponse.json();

      // Asocia las direcciones con los bares
      const barsWithAddresses = barsData.bars.map(bar => {
        const address = addressesData.find(addr => addr.id === bar.address_id);
        return { ...bar, address }; // Combina los datos del bar con su dirección
      });

      setBars(barsWithAddresses); // Almacena los bares con direcciones
      setFilteredBars(barsWithAddresses); // Inicialmente, todos los bares están en filteredBars
    };

    fetchBarsAndAddresses();
  }, []);

  // Inicializar el mapa
  useEffect(() => {
    if (!libraries) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];
    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 2,
    });
  }, [libraries]);

  // Ajustar los límites del mapa
  useEffect(() => {
    if (!libraries || !mapRef.current) return;
    if (filteredBars.length === 0) return; // Evita errores si no hay bares

    const bounds = new google.maps.LatLngBounds();
    filteredBars.forEach((bar) => bounds.extend({ lat: bar.latitude, lng: bar.longitude }));
    mapRef.current.fitBounds(bounds);
  }, [libraries, filteredBars]);

  const generateMarkers = (bars, Marker, PinElement, InfoWindow) => {
    return bars.map(({ id, name, latitude, longitude, address }) => {
      const position = { lat: latitude, lng: longitude };
      const pin = new PinElement();
      pin.glyph = `${name}`;
      pin.glyphColor = '#000000';
      pin.background = '#de7800';
      pin.borderColor = '#ffffff';

      const marker = new Marker({ position, content: pin.element });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // Configura el contenido del InfoWindow con la dirección y el enlace al bar
        const content = `
          <div>
            <h4><a href="http://localhost:3000/bars/${id}" target="_blank">${name}</a></h4>
            <p style="color: black">${address.line1}, ${address.line2 ? address.line2 + ', ' : ''}${address.city}</p>
          </div>
        `;
        const infoWindow = new InfoWindow({
          content,
          position,
        });
        infoWindow.open(mapRef.current, marker);
        infoWindowRef.current = infoWindow;
      });

      return marker;
    });
  };

  // Generar y añadir los marcadores al mapa
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
    const markers = generateMarkers(filteredBars, Marker, PinElement, InfoWindow);
    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [filteredBars, libraries]);

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
