import React, { useEffect, useState } from 'react';
import MapView, { Polyline, UrlTile, Marker } from 'react-native-maps';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';  // Importing Location correctly

const { width, height } = Dimensions.get('window');

export default function App() {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [source, setSource] = useState<{ latitude: number, longitude: number } | null>(null); // To store user's real location
  const [destination, setDestination] = useState({
    latitude:26.26,
    longitude: 88.18838, // Example destination
  });

  useEffect(() => {
    // Function to get user's location
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setSource({
        latitude: location.coords.latitude,  // Accessing coordinates correctly
        longitude: location.coords.longitude, // Accessing coordinates correctly
      });
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (source) {
      // Fetch route from OSRM using user's real location as the source
      const getRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          const routeCoords = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          setRouteCoordinates(routeCoords);
        } catch (error) {
          console.log('Error fetching route:', error);
        }
      };

      getRoute();
    }
  }, [source, destination]);

  return (
    <View style={styles.container}>
         {source ? (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: source?.latitude || 37.7749,
          longitude: source?.longitude || -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Use OpenStreetMap tiles */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* Draw the route using Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF0000" // Red color for the route
            strokeWidth={3}
          />
        )}

        {/* Add a marker for the user's current location */}
        {source && (
          <Marker
            coordinate={source}
            title="You are here"
            description="This is your current location"
          />
        )}

        {/* Add a marker for the destination */}
        <Marker
          coordinate={destination}
          title="Destination"
          description="This is your destination"
        />
      </MapView> ) : null}  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
  },
});
