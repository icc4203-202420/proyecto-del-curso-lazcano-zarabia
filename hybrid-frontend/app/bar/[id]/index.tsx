import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, Button, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/UserContext';
import axiosInstance from '@/config/axiosInstance'; // Asegúrate de importar tu instancia de Axios

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
  checked_in?: boolean;
}

export default function BarDetail() {
  const [bar, setBar] = useState<Bar | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const { userId } = useUser();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    console.log('SE EJECUTA EL USEEFFECT');
    console.log('refresh', refresh);
    const fetchBarData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/bars/${id}`);
        setBar(response.data.bar);
      } catch (error) {
        console.error('Error al obtener el bar:', error);
        Alert.alert('Error', 'No se pudo obtener la información del bar');
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      if (!userId) return;
      try {
        const response = await axiosInstance.get(`/api/v1/bars/${id}/events/attendance/${userId}`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        Alert.alert('Error', 'No se pudo obtener los eventos del bar');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchBarData();

    if (userId) {
      fetchEvents();
    }
  }, [id, userId]);

  const confirmAttendance = async (eventId: string) => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener el ID del usuario');
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/v1/events/${eventId}/attendances`, {
        user_id: userId,
        event_id: eventId,
      });

      if (response.status === 200) {
        Alert.alert('Asistencia confirmada', '¡Has confirmado tu asistencia a este evento!');
        //setRefresh(!refresh);
        
      } else {
        Alert.alert('Error', 'No se pudo confirmar la asistencia');
      }
    } catch (error) {
      console.error('Error al confirmar asistencia:', error);
      Alert.alert('Error', 'Ocurrió un error al confirmar la asistencia');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {bar ? (
        <>
          <Text style={styles.text}>Nombre bar: {bar.name}</Text>
        </>
      ) : (
        <Text>No se encontró la información del bar.</Text>
      )}

      <Text style={styles.sectionTitle}>Eventos en este Bar</Text>

      {bar?.events_count > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(event) => event.id}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <TouchableOpacity onPress={() => router.push(`/event/${item.id}`)}>
                <Text style={styles.eventName}>{item.name}</Text>
              </TouchableOpacity>
              <Text style={styles.eventDescription}>{item.description}</Text>
              <Text style={styles.eventDate}>Fecha: {item.date}</Text>

              {item.checked_in ? (
                <Text style={styles.attendingText}>Asistencia confirmada</Text>
              ) : (
                <TouchableOpacity
                  style={styles.attendButton}
                  onPress={() => {
                    confirmAttendance(item.id);
                  }}
                >
                  <Text style={styles.attendButtonText}>Confirmar Asistencia</Text>
                </TouchableOpacity>
              )}
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
    color: '#007bff',
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
  attendButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  attendButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  attendingText: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  noEventsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
