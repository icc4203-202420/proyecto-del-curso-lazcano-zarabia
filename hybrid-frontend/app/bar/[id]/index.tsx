import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Bar {
    id: string;
    name: string;
    address: string;
    description: string;
    events_count: number;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  // Agrega otros campos según los datos que tengas para el evento
}

export default function BarDetail() {
  const [bar, setBar] = useState<Bar | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID del bar de los parámetros de la URL

  useEffect(() => {
    // Función para obtener los datos del bar
    const fetchBarData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBar(data.bar);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del bar');
        }
      } catch (error) {
        console.error('Error al obtener el bar:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener la información del bar');
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/v1/bars/${id}/events`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data); 
        } else {
          Alert.alert('Error', 'No se pudo obtener los eventos del bar');
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener los eventos');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchBarData();
    fetchEvents();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {bar ? (
        <>
          <h1>Nombre bar: {bar.name}</h1>
        </>
      ) : (
        <Text>No se encontró la información del bar.</Text>
      )}

      <Text style={styles.sectionTitle}>Eventos en este Bar</Text>
      
      {eventsLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : bar.events_count > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(event) => event.id}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
              <Text style={styles.eventDate}>Fecha: {item.date}</Text>
              <Text style={styles.eventTime}>Hora: {item.start_time} - {item.end_time}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noEventsText}>No hay eventos programados para este bar.</Text>
      )}

      <Button title="Volver a Inicio" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    color: '#333',
  },
  eventTime: {
    fontSize: 16,
    color: '#333',
  },
  noEventsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
