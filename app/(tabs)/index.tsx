import React, { useState, useEffect } from 'react';
import { StyleSheet, View ,Text} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';

export default function App() {
  // Type the state to accept either null or a valid LocationObject
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log(currentLocation);
      
      setLocation(currentLocation);  // This will now work correctly
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        
        <MapView
          style={styles.map}
          showsUserLocation={true} // This shows the user’s location
          followsUserLocation={true} // Automatically follow the user's location
          initialRegion={{
            latitude: location.coords.latitude,    // Use the latitude from location state
            longitude: location.coords.longitude,  // Use the longitude from location state
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

       
      ) : null}  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
});
