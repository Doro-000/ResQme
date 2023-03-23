import { useState, useEffect, useRef } from "react";

import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";

// STORE
import { useStoreState, useStoreActions } from "easy-peasy";

// LOCATION
// import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

// const LOCATION_TASK_NAME = "background-location-task";

import VictimDetail from "./VictimDetail";

export default function Map() {
  // location
  const setLocation = useStoreActions((actions) => actions.setLocation);
  const location = useStoreState((state) => state.location);

  // permissions
  const setPermissions = useStoreActions((actions) => actions.setPermissions);

  // ui
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  // victims
  const [victims, setVictims] = useState([]);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [bottomSheetActive, setBottomSheetActive] = useState(false);

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

  const getVictims = async () => {
    const points = new Promise((resolve) => {
      return resolve([
        {
          latlng: { latitude: 53.17167033346971, longitude: 8.656929163755606 },
          title: "Abebe",
          description: "Click to see more details !",
          id: "1",
        },
        {
          latlng: {
            latitude: 53.161143478761694,
            longitude: 8.646358017780486,
          },
          title: "Abebe",
          description: "Click to see more details !",
          id: "2",
        },
        {
          latlng: {
            latitude: 53.169008220980636,
            longitude: 8.652513014217224,
          },
          title: "Abebe",
          description: "Click to see more details !",
          id: "3",
        },
        {
          latlng: { latitude: 53.16956101637453, longitude: 8.656865927034149 },
          title: "Abebe",
          description: "Click to see more details !",
          id: "4",
        },
      ]);
    });

    setTimeout(async () => {
      setVictims(await points);
    }, 200);
  };

  const toggleBottomSheet = () => {
    setBottomSheetActive(!bottomSheetActive);
  };

  useEffect(() => {
    getLocation();
    getVictims();
  }, []);

  return (
    <>
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
                zoom: 15,
              });
            }}
          >
            {victims.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={marker.latlng}
                  title={marker.title}
                  description={marker.description}
                  identifier={marker.id}
                  onPress={(e) => {
                    setSelectedVictim(e.nativeEvent.id);
                    console.log(selectedVictim);
                  }}
                  onCalloutPress={(_) => {
                    toggleBottomSheet();
                  }}
                />
              );
            })}
          </MapView>
        ) : (
          <Text> {errorMsg}</Text>
        )}
        <VictimDetail active={bottomSheetActive} />
      </View>
    </>
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
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
});
