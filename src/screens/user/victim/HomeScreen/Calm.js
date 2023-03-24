import React, { useEffect, useRef, useState, useCallback } from "react";

import { View, StyleSheet, Text } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";
import { MaterialIcons } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import Map from "../../common/Map";
import VictimDetail from "../../common/VictimDetail";

export default function Calm({ navigation }) {
  const [victims, setVictims] = useState([]);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [bottomSheetActive, setBottomSheetActive] = useState(false);

  // Bottom sheet
  const bottomSheetRef = useRef(null);

  const getVictims = async () => {
    const points = new Promise((resolve) => {
      return resolve([
        {
          latlng: { latitude: 53.17167033346971, longitude: 8.656929163755606 },
          title: "Abebe",
          description: "Click to see more details !",
          id: "1",
        },
      ]);
    });

    setTimeout(async () => {
      setVictims(await points);
    }, 200);
  };

  const toggleBottomSheet = () => {
    if (bottomSheetActive) {
      bottomSheetRef.current.close();
    } else {
      bottomSheetRef.current.collapse();
    }
    setBottomSheetActive(bottomSheetActive ^ true);
  };

  // backdrop
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.3}
      />
    ),
    []
  );

  useEffect(() => {
    getVictims();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={style.mapStyle}>
        <Map>
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
                }}
                onCalloutPress={(_) => {
                  toggleBottomSheet();
                }}
              />
            );
          })}
        </Map>
      </View>

      <SwipeButton
        goBackToStart
        Icon={
          <MaterialIcons
            name="keyboard-arrow-right"
            size={50}
            color="#DD404B"
          />
        }
        iconContainerStyle={{
          backgroundColor: "#152228",
        }}
        onComplete={() => navigation.navigate("Panic")}
        title="RESCUE ME !"
        borderRadius={180}
        underlayTitle="Release to complete"
        underlayTitleStyle={{ color: "white" }}
        containerStyle={style.swipeButtonStyle}
        completeThresholdPercentage={80}
        titleStyle={{
          color: "white",
          fontWeight: "bold",
        }}
      />
      <VictimDetail
        changeBottomSheetActive={setBottomSheetActive}
        bottomSheetRef={bottomSheetRef}
        currentVictim={selectedVictim}
        backDrop={renderBackdrop}
      />
    </View>
  );
}

const style = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
  swipeButtonStyle: {
    bottom: 20,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "#999999",
  },
});
