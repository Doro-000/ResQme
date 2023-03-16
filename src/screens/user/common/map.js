import { useState, useEffect, useRef } from "react";

import MapView from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";

// STORE
import { useStoreState, useStoreActions } from "easy-peasy";

// LOCATION
import * as Location from "expo-location";

export default function Map() {
  const setLocation = useStoreActions((actions) => actions.setLocation);
  const location = useStoreState((state) => state.location);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const getLocation = async () => {
    setLoading(true);

    let { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setLoading(false);
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync();
      setLocation(location.coords);
    } catch (error) {
      setErrorMsg("Couldn't fetch Location, try again !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading Map...</Text>
      ) : location ? (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          ref={mapRef}
          onLayout={() => {
            mapRef.current.animateCamera({
              center: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              pitch: 0,
              heading: 0,
              zoom: 14,
            });
          }}
        />
      ) : (
        <Text> {errorMsg}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
