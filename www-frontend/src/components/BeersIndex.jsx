import React, { useState } from 'react';
import DataFetcher from './DataFetcher';

function BeersIndex() {
  const [beers, setBeers] = useState([]);  // Inicializamos beers como un array vacío

  // Función que maneja la búsqueda
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setBeers(beers.filter(beer => beer.name.toLowerCase().includes(searchTerm)));
  };

  // Función que maneja los datos recibidos del DataFetcher
  const handleDataFetched = (data) => {
    setBeers(data.beers);  // Aquí extraemos el array de cervezas del objeto de respuesta
  };

  return (
    <div>
      <h1>Lista de Cervezas</h1>
      <input 
        type="text" 
        placeholder="Buscar cervezas..." 
        onChange={handleSearch}
      />
      <ul>
        {/* Verificamos que beers sea un array antes de aplicar .map */}
        {Array.isArray(beers) && beers.map(beer => (
          <li key={beer.id}>{beer.name}</li>
        ))}
      </ul>
      <DataFetcher endpoint="http://127.0.0.1:3001/api/v1/beers" onDataFetched={handleDataFetched} />
    </div>
  );
}

export default BeersIndex;
