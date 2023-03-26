import { useState, useEffect, useRef } from "react";

// UI
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import {
  IconButton,
  Modal,
  Divider,
  RadioButton,
  Button,
  Text,
} from "react-native-paper";

// STORE
import { useStoreState, useStoreActions } from "easy-peasy";

// LOCATION
// import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

// const LOCATION_TASK_NAME = "background-location-task";

export default function Map({ children, mapRef, layoutAnimation }) {
  const { setPermissions, setLocation } = useStoreActions((a) => a);

  const { location } = useStoreState((s) => s);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [visible, setVisible] = useState(false);

  const [mapType, setMapType] = useState("standard");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
        <View>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            ref={mapRef}
            onLayout={layoutAnimation}
            toolbarEnabled={false}
            mapType={mapType}
          >
            {children}
          </MapView>
          <IconButton
            icon="layers"
            style={styles.layerButton}
            mode={"contained"}
            iconColor="#646464"
            containerColor="white"
            onPress={showModal}
          />
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            <Text variant="headlineSmall">Change Map Type</Text>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <View>
                <RadioButton.Item
                  value="standard"
                  label="Standard"
                  status={mapType === "standard" ? "checked" : "unchecked"}
                  onPress={() => setMapType("standard")}
                />
                <RadioButton.Item
                  value="satellite"
                  label="Satellite"
                  status={mapType === "satellite" ? "checked" : "unchecked"}
                  onPress={() => setMapType("satellite")}
                />
              </View>
              <View>
                <RadioButton.Item
                  value="hybrid"
                  label="Hybrid"
                  status={mapType === "hybrid" ? "checked" : "unchecked"}
                  onPress={() => setMapType("hybrid")}
                />
                <RadioButton.Item
                  value="terrain"
                  label="Terrain"
                  status={mapType === "terrain" ? "checked" : "unchecked"}
                  onPress={() => setMapType("terrain")}
                />
              </View>
            </View>
            <Button
              icon="check"
              style={{
                alignSelf: "flex-end",
              }}
              onPress={hideModal}
            >
              Save
            </Button>
          </Modal>
        </View>
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
  layerButton: {
    position: "absolute",
    top: 50,
    right: 4,
    opacity: 0.7,
    borderRadius: 3.5,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    flexBasis: "auto",
    flexShrink: 1,
    gap: 10,
  },
});
