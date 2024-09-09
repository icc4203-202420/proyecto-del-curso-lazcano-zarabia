import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Slider, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const BeerReviewIndex = () => {
  const { id } = useParams(); 
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(3); 
  const [selectedUserId, setSelectedUserId] = useState(''); 

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
  
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/v1/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const result = await response.json();
        setUsers(result.users);
      } catch (error) {
        setIsError(true);
      }
    };
  
    fetchReviews();
    fetchUsers();
  }, [id]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulario enviado");
  
    if (!selectedUserId || reviewText.length > 15) {
      alert('Por favor, selecciona un usuario y escribe una reseña con máximo 15 palabras.');
      return;
    }
  
    const newReview = {
      text: reviewText,
      rating: reviewRating,
      beer_id: id,
      user_id: selectedUserId,
    };

    console.log("Datos enviados al backend:", newReview);
  
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),  
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar la reseña');
      }
  
      const createdReview = await response.json();  
      console.log('Nueva reseña creada:', createdReview);
      setReviews([...reviews, createdReview]); 
      setReviewText('');
      setReviewRating(3);
      setSelectedUserId('');
    } catch (error) {
        console.error('Error en la solicitud:', error);  
        setIsError(true);
    }
  };
  

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (isError) {
    return <p>There was an error loading the reviews.</p>;
  }

  return (
    <div>
      <h3>Dejar una reseña</h3>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel id="user-select-label">Seleccionar usuario</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.handle})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div>
          <TextField
            label="Reseña"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            inputProps={{ maxLength: 15 }} 
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <label>Rating: {reviewRating}</label>
          <Slider
            value={reviewRating}
            onChange={(e, newValue) => setReviewRating(newValue)}
            step={0.1}
            min={1}
            max={5}
            valueLabelDisplay="auto"
          />
        </div>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Enviar reseña
        </Button>
      </form>

      <h2>Reviews for Beer {id}</h2>
      
        <ul>
            {reviews.map((review) => {
                const user = users.find((u) => u.id === review.user_id); 
                return (
                    <li key={review.id}>
                    <p>Rating: {review.rating}</p>
                    <p>User: {user ? user.handle : 'Usuario desconocido'}</p>
                    <p>{review.text}</p>
                    </li>
                );
            })}
        </ul>

    </div>
  );
};

export default BeerReviewIndex;
