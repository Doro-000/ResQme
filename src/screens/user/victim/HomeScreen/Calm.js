import React, { useEffect, useRef, useState, useCallback } from "react";

import { View, StyleSheet, Text } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";
import { MaterialIcons } from "@expo/vector-icons";
import { Marker, Heatmap } from "react-native-maps";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { SegmentedButtons } from "react-native-paper";

import Map from "../../common/Map";
import VictimDetail from "../../common/VictimDetail";

import { useStoreState } from "easy-peasy";

import { geoFire } from "@firebaseConfig";

export default function Calm({ navigation }) {
  const [victims, setVictims] = useState([]);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [bottomSheetActive, setBottomSheetActive] = useState(false);

  const { user, location } = useStoreState((s) => s);

  const [mapMode, setMapMode] = useState("pin");

  const mapRef = useRef(null);

  // Bottom sheet
  const bottomSheetRef = useRef(null);

  const getVictims = async () => {
    // const points =

    const points = new Promise((resolve) => {
      return resolve([
        {
          latlng: {
            latitude: 53.203055129712205,
            longitude: 8.668798157301332,
          },
        },
        {
          latlng: {
            latitude: 53.15919722944383,
            longitude: 8.595539857846084,
          },
        },
        {
          latlng: {
            latitude: 53.16520216280792,
            longitude: 8.722915651357392,
          },
        },
        {
          latlng: {
            latitude: 53.13055252241309,
            longitude: 8.631452016914237,
          },
        },
        {
          latlng: {
            latitude: 53.19736604656789,
            longitude: 8.694534389352329,
          },
        },
        {
          latlng: {
            latitude: 53.18539799319881,
            longitude: 8.655637232297403,
          },
        },
        {
          latlng: {
            latitude: 53.18818929501683,
            longitude: 8.661089133402687,
          },
        },
        {
          latlng: {
            latitude: 53.1643703717651,
            longitude: 8.635724406416314,
          },
        },
        {
          latlng: {
            latitude: 53.17449725051564,
            longitude: 8.60819751028583,
          },
        },
        {
          latlng: {
            latitude: 53.203245903351686,
            longitude: 8.687531783922461,
          },
        },
        {
          latlng: {
            latitude: 53.15141130308814,
            longitude: 8.68174477187264,
          },
        },
        {
          latlng: {
            latitude: 53.136960152014545,
            longitude: 8.610706440853347,
          },
        },
        {
          latlng: {
            latitude: 53.127455098163914,
            longitude: 8.628460437677173,
          },
        },
        {
          latlng: {
            latitude: 53.16878545523266,
            longitude: 8.642025339303162,
          },
        },
        {
          latlng: {
            latitude: 53.15076709007191,
            longitude: 8.639351769725042,
          },
        },
        {
          latlng: {
            latitude: 53.1705842278758,
            longitude: 8.656365807844505,
          },
        },
        {
          latlng: {
            latitude: 53.149357862274435,
            longitude: 8.709500158110473,
          },
        },
        {
          latlng: {
            latitude: 53.15310847234888,
            longitude: 8.606207984707376,
          },
        },
        {
          latlng: {
            latitude: 53.138482688655934,
            longitude: 8.702515810738337,
          },
        },
        {
          latlng: {
            latitude: 53.14248256252429,
            longitude: 8.68721188578933,
          },
        },
        {
          latlng: {
            latitude: 53.13476962699874,
            longitude: 8.61800867176693,
          },
        },
        {
          latlng: {
            latitude: 53.133268302251466,
            longitude: 8.70129825990525,
          },
        },
        {
          latlng: {
            latitude: 53.18555749806284,
            longitude: 8.684142181067383,
          },
        },
        {
          latlng: {
            latitude: 53.189236197094324,
            longitude: 8.657132144199597,
          },
        },
        {
          latlng: {
            latitude: 53.130540262988546,
            longitude: 8.669281331111208,
          },
        },
        {
          latlng: {
            latitude: 53.17678686550567,
            longitude: 8.650022702144659,
          },
        },
        {
          latlng: {
            latitude: 53.12734531603508,
            longitude: 8.63794191352723,
          },
        },
        {
          latlng: {
            latitude: 53.19132897334594,
            longitude: 8.670514268447324,
          },
        },
        {
          latlng: {
            latitude: 53.16236019864878,
            longitude: 8.65329467164288,
          },
        },
        {
          latlng: {
            latitude: 53.19238119846632,
            longitude: 8.664990962439537,
          },
        },
        {
          latlng: {
            latitude: 53.171681744322264,
            longitude: 8.65964183824628,
          },
        },
        {
          latlng: {
            latitude: 53.16873653119955,
            longitude: 8.705474400237469,
          },
        },
        {
          latlng: {
            latitude: 53.173818545603005,
            longitude: 8.6361543928297,
          },
        },
        {
          latlng: {
            latitude: 53.18405032847173,
            longitude: 8.655044171453275,
          },
        },
        {
          latlng: {
            latitude: 53.14071766434107,
            longitude: 8.678434113930313,
          },
        },
        {
          latlng: {
            latitude: 53.13043543279356,
            longitude: 8.66101636712968,
          },
        },
        {
          latlng: {
            latitude: 53.1357216333346,
            longitude: 8.65049270237313,
          },
        },
        {
          latlng: {
            latitude: 53.1844661450192,
            longitude: 8.594280116893465,
          },
        },
        {
          latlng: {
            latitude: 53.19165227484583,
            longitude: 8.63757761611616,
          },
        },
        {
          latlng: {
            latitude: 53.142125869301786,
            longitude: 8.643622139282654,
          },
        },
        {
          latlng: {
            latitude: 53.15625676646253,
            longitude: 8.622772073101226,
          },
        },
        {
          latlng: {
            latitude: 53.20398279303361,
            longitude: 8.662677489543013,
          },
        },
        {
          latlng: {
            latitude: 53.18974348128358,
            longitude: 8.59951123126834,
          },
        },
        {
          latlng: {
            latitude: 53.127682431954895,
            longitude: 8.676016258014206,
          },
        },
        {
          latlng: {
            latitude: 53.185705493266234,
            longitude: 8.647172655313161,
          },
        },
        {
          latlng: {
            latitude: 53.207156315634144,
            longitude: 8.655863700059797,
          },
        },
        {
          latlng: {
            latitude: 53.152605767122495,
            longitude: 8.657012607765928,
          },
        },
        {
          latlng: {
            latitude: 53.19707551831169,
            longitude: 8.602456413854062,
          },
        },
        {
          latlng: {
            latitude: 53.13694222038413,
            longitude: 8.612439943380835,
          },
        },
        {
          latlng: {
            latitude: 53.15675602108174,
            longitude: 8.70203430116438,
          },
        },
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

  const getVictimPoints = () => {
    return victims.map(({ latlng }) => ({
      latitude: latlng.latitude,
      longitude: latlng.longitude,
    }));
  };

  // map Animations
  const pinAnimation = () => {
    mapRef.current.animateCamera({
      center: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      pitch: 0,
      heading: 0,
      zoom: 14,
    });
  };

  const heatAnimation = () => {
    mapRef.current.animateCamera({
      center: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      pitch: 0,
      heading: 0,
      zoom: 11.5,
    });
  };

  const changeMapType = (value) => {
    if (value === "pin") {
      pinAnimation();
    } else {
      heatAnimation();
    }
    setMapMode(value);
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
        <Map
          mapRef={mapRef}
          layoutAnimation={mapMode === "pin" ? pinAnimation : heatAnimation}
        >
          {user.isNgo && mapMode === "heatMap" ? (
            <>
              <Heatmap points={getVictimPoints()} radius={40} />
            </>
          ) : (
            <>
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
            </>
          )}
        </Map>
      </View>

      {user.isNgo === undefined ? (
        <></>
      ) : (
        <>
          {user.isNgo ? (
            <SegmentedButtons
              value={mapMode}
              onValueChange={changeMapType}
              style={style.segmentedButtonStyle}
              buttons={[
                {
                  value: "heatMap",
                  label: "Heat map 🔥",
                  showSelectedCheck: true,
                },
                {
                  value: "pin",
                  label: "Map pins 📍",
                  showSelectedCheck: true,
                },
              ]}
              density="regular"
            />
          ) : (
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
          )}
        </>
      )}

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
  segmentedButtonStyle: {
    bottom: 30,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 15,
  },
});
