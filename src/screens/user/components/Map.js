import { useState } from "react";

// UI
// import MapView from "react-native-map-clustering";
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

export default function Map({
  children,
  mapRef,
  layoutAnimation,
  refreshData,
}) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [mapType, setMapType] = useState("standard");

  return (
    <View>
      <MapView
        provider="google"
        style={styles.map}
        showsUserLocation={true}
        ref={mapRef}
        onLayout={layoutAnimation}
        toolbarEnabled={false}
        mapType={mapType}
        loadingEnabled
      >
        {children}
      </MapView>
      <IconButton
        icon="layers"
        style={[styles.actionButton, styles.layerButton]}
        mode={"contained"}
        iconColor="#646464"
        containerColor="white"
        onPress={showModal}
      />
      <IconButton
        icon="refresh"
        style={[styles.actionButton, styles.refreshButton]}
        mode={"contained"}
        iconColor="#646464"
        containerColor="white"
        onPress={refreshData}
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
  );
}

/// credit to: https://stackoverflow.com/a/53868257
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  actionButton: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 3.5,
  },
  layerButton: {
    top: 50,
    right: 4,
  },
  refreshButton: {
    top: 100,
    right: 4,
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
