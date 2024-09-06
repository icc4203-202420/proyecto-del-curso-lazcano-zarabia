import React, { useEffect, useState } from 'react';

function DataFetcher({ endpoint, onDataFetched }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        onDataFetched(data);  // Pasamos los datos al componente padre
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();  // Llamada a la API al montar el componente
  }, [endpoint]);  // Se ejecuta solo cuando el componente se monta

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return null;  // No renderiza nada, solo realiza la llamada
}

export default DataFetcher;
