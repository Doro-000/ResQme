import { useState, useEffect, useRef } from "react";

// UI
import MapView from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";

// STORE
import { useStoreState, useStoreActions } from "easy-peasy";

// LOCATION
// import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

// const LOCATION_TASK_NAME = "background-location-task";

export default function Map({ children }) {
  const { setPermissions, setLocation } = useStoreActions((a) => a);

  const { location } = useStoreState((s) => s);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const getLocation = async () => {
    setLoading(true);

    const { granted: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    // if (foregroundStatus) {
    //   const { granted: backgroundStatus } =
    //     await Location.requestBackgroundPermissionsAsync();
    //   if (backgroundStatus) {
    //     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    //       accuracy: Location.Accuracy.Lowest, // Background location update
    //       deferredUpdatesInterval: 20000, // 2 minutes
    //     });
    //   }
    // }
    setPermissions(foregroundStatus);

    if (!foregroundStatus) {
      setLoading(false);
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // for inital location
      });
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
    <View>
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
              zoom: 15,
            });
          }}
        >
          {children}
        </MapView>
      ) : (
        <Text> {errorMsg}</Text>
      )}
    </View>
  );
}

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
//   if (error) {
//     console.log(error.message);
//   }
// });

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
