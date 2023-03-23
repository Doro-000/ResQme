import React from "react";

import { View, StyleSheet, Text } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";
import { MaterialIcons } from "@expo/vector-icons";

import Map from "../../common/Map";
import VictimDetail from "../../common/VictimDetail";

export default function Calm({ navigation }) {
  return (
    <>
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={style.mapStyle}>
          <Map />
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
        {/* <VictimDetail /> */}
      </View>
    </>
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
