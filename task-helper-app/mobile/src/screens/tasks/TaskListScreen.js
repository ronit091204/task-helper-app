import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      fetchNearbyTasks(location.coords);
    })();
  }, []);

  const fetchNearbyTasks = async (coords) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/tasks/nearby?longitude=${coords.longitude}&latitude=${coords.latitude}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskPrice}>${item.price}</Text>
      <TouchableOpacity style={styles.acceptButton}>
        <Text style={styles.acceptButtonText}>Accept Task</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  listContainer: {
    padding: 15
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  taskDescription: {
    marginTop: 5,
    color: '#666'
  },
  taskPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 10
  },
  acceptButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16
  }
});