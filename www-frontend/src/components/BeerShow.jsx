import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BeerShow = ({ beers }) => {
  const { id } = useParams(); // Obtener el id de la cerveza desde la URL
  const beer = beers.find((beer) => beer.id === parseInt(id)); // Buscar la cerveza por id

  if (!beer) {
    return <p>Cerveza no encontrada</p>; // Mostrar mensaje si no se encuentra la cerveza
  }

  return (
    <div>
      <h1>{beer.name}</h1>
      <p><strong>Estilo:</strong> {beer.style}</p>
      <p><strong>Lúpulo:</strong> {beer.hop}</p>
      <p><strong>Levadura:</strong> {beer.yeast}</p>
      <p><strong>Malta:</strong> {beer.malts}</p>
      <p><strong>IBU:</strong> {beer.ibu}</p>
      <p><strong>Alcohol:</strong> {beer.alcohol}</p>
      <p><strong>BLG:</strong> {beer.blg}</p>

      {/* Agregar el enlace para ver las reseñas */}
      <Link to={`/beers/${beer.id}/reviews`}>Ver reseñas</Link>
    </div>
  );
};

export default BeerShow;
