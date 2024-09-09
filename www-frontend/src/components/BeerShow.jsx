import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BeerShow = ({ beers }) => {
  const { id } = useParams(); 
  const beer = beers.find((beer) => beer.id === parseInt(id)); 

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const result = await response.json();
        setReviews(result);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

 
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviews.length).toFixed(1)
    : 'No reviews yet';

  if (!beer) {
    return <p>Cerveza no encontrada</p>; 
  }

  if (isLoading) {
    return <p>Cargando reseñas...</p>;
  }

  if (isError) {
    return <p>Error al cargar las reseñas</p>;
  }

  return (
    <div>
      <h1>
        {beer.name} <span style={{ fontSize: '1.2rem' }}>({averageRating} estrellas)</span>
      </h1>
      <p><strong>Estilo:</strong> {beer.style}</p>
      <p><strong>Lúpulo:</strong> {beer.hop}</p>
      <p><strong>Levadura:</strong> {beer.yeast}</p>
      <p><strong>Malta:</strong> {beer.malts}</p>
      <p><strong>IBU:</strong> {beer.ibu}</p>
      <p><strong>Alcohol:</strong> {beer.alcohol}</p>
      <p><strong>BLG:</strong> {beer.blg}</p>

      <Link to={`/beers/${beer.id}/reviews`}>Ver reseñas</Link>
    </div>
  );
};

export default BeerShow;

