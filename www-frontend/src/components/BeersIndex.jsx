import React, { useState } from 'react';
import DataFetcher from './DataFetcher';

const Beers = () => {
  const [beers, setBeers] = useState([]);

  const handleDataFetched = (data) => {
    setBeers(data);
  };

  return (
    <div>
      <h1>Beers List</h1>
      <DataFetcher endpoint="http://127.0.0.1:3001/api/v1/beers" onDataFetched={handleDataFetched} />
      <ul>
        {beers.map(beer => (
          <li key={beer.id}>{beer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Beers;
