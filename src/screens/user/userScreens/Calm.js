// React
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// UI
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeButton } from "react-native-expo-swipe-button";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { SegmentedButtons, Banner, Text } from "react-native-paper";

import Map from "../components/Map";
import VictimDetail from "../components/VictimDetail";
import MapMarker from "../components/MapMarker";

// Map
import { Heatmap } from "react-native-maps";

// State
import { useStoreState, useStoreActions } from "easy-peasy";

// Firebase
import { rdb } from "@firebaseConfig";
import { ref, get } from "firebase/database";

// Utils
import { randFullName } from "@ngneat/falso";
import { isEmpty, values } from "lodash";
import { randPhoneNumber, randNumber, randBetweenDate } from "@ngneat/falso";
import { DateTime } from "luxon";
import { useIsFocused } from "@react-navigation/native";
import { sendLocation } from "@utils";

export default function Calm({ navigation }) {
  // State
  const isFocused = useIsFocused();
  const [victims, setVictims] = useState([]);
  const [currentVictimData, setCurrentVictimData] = useState(null);
  const [sampleVictim, setSampleVictim] = useState(false);
  const [bottomSheetActive, setBottomSheetActive] = useState(false);

  const { user, location } = useStoreState((s) => s);
  const { setLocation } = useStoreActions((a) => a);

  const [mapMode, setMapMode] = useState("pin");
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);

  // Generate Random Victims
  const randomVictims = useMemo(() => {
    if (!isEmpty(location)) {
      return [
        ...getRandomVictims(5, 1000, location, 0),
        ...getRandomVictims(10, 5000, location, 5),
        ...getRandomVictims(100, 50000, location, 10),
      ];
    }
    return [];
  }, []);

  // Funcs
  const updateVictims = async () => {
    const rdbRef = ref(rdb, "victims");
    const locations = await get(rdbRef);

    const res = [...randomVictims];
    if (!isEmpty(locations)) {
      values(locations.val()).forEach((val) => {
        if (val.latlng) {
          const idx = res.findIndex((e) => e.id === val.id);
          const temp = {
            title: val.name,
            id: val.id,
            latlng: val.latlng,
            lastSeen: val.lastSeen,
          };
          if (idx > -1) {
            res[idx] = temp;
          } else {
            res.push(temp);
          }
        }
      });
    }

    setVictims(res);
  };

  const toggleBottomSheet = () => {
    if (bottomSheetActive) {
      bottomSheetRef.current.close();
    } else {
      bottomSheetRef.current.collapse();
    }
    setBottomSheetActive(!bottomSheetActive);
  };

  const getVictimPoints = () => {
    return victims.map(({ latlng }) => ({
      latitude: latlng.latitude,
      longitude: latlng.longitude,
    }));
  };

  const changeMapType = (value) => {
    if (value === "pin") {
      pinAnimation();
    } else {
      heatAnimation();
    }
    setMapMode(value);
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.3}
        rdbRef
      />
    ),
    []
  );

  const onPress = (e) => {
    const id = e.nativeEvent.id;
    const randomVictim = randomVictims.filter((item) => item.id === id);
    let victimData = {};
    if (!isEmpty(randomVictim)) {
      victimData = randomVictim[0];
      setSampleVictim(true);
    } else {
      const realVicitm = victims.filter((item) => item.id === id);
      victimData = realVicitm[0];
      setSampleVictim(false);
    }
    setCurrentVictimData(victimData);
  };

  const onCalloutPress = (_) => {
    toggleBottomSheet();
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
      zoom: 15,
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

  const renderMarkers = () => {
    return victims.map((marker, index) => (
      <MapMarker
        key={index}
        index={index}
        marker={marker}
        onPress={onPress}
        onCalloutPress={onCalloutPress}
        cluster
        coordinate={marker.latlng}
      />
    ));
  };

  // UI
  useEffect(() => {
    if (isFocused) {
      updateVictims();
    }
    if (user.mode === "Independent") {
      const volunteerRef = ref(rdb, `volunteers/${user.id}`);
      sendLocation(volunteerRef, 900000, setLocation, user, location);
    }
  }, [isFocused]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Banner visible={user.mode === "Independent"} icon={"information"}>
        <Text
          variant="titleMedium"
          style={{
            lineHeight: 40,
          }}
        >
          Sharing your contact and location with professional teams...
        </Text>
      </Banner>
      <View style={style.mapStyle}>
        <Map
          mapRef={mapRef}
          layoutAnimation={mapMode === "pin" ? pinAnimation : heatAnimation}
          refreshData={updateVictims}
        >
          {user.mode === "ProSAR" && mapMode === "heatMap" ? (
            <Heatmap points={getVictimPoints()} radius={35} />
          ) : (
            renderMarkers()
          )}
        </Map>
      </View>

      {user.mode === undefined ? (
        <></>
      ) : (
        <>
          {user.mode === "ProSAR" ? (
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
        victimData={currentVictimData}
        sampleVictim={sampleVictim}
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

// credit to: https://stackoverflow.com/a/28699123
const getRandomCoordinates = function (radius, uniform) {
  // Generate two random numbers
  let a = Math.random(),
    b = Math.random();

  // Flip for more uniformity.
  if (uniform) {
    if (b < a) {
      var c = b;
      b = a;
      a = c;
    }
  }

  // It's all triangles.
  return [
    b * radius * Math.cos((2 * Math.PI * a) / b),
    b * radius * Math.sin((2 * Math.PI * a) / b),
  ];
};

const getRandomLocation = function (latitude, longitude, radiusInMeters) {
  const randomCoordinates = getRandomCoordinates(radiusInMeters, true);

  // Earths radius in meters via WGS 84 model.
  const earth = 6378137;

  // Offsets in meters.
  const northOffset = randomCoordinates[0],
    eastOffset = randomCoordinates[1];

  // Offset coordinates in radians.
  const offsetLatitude = northOffset / earth,
    offsetLongitude =
      eastOffset / (earth * Math.cos(Math.PI * (latitude / 180)));

  // Offset position in decimal degrees.
  return {
    latitude: latitude + offsetLatitude * (180 / Math.PI),
    longitude: longitude + offsetLongitude * (180 / Math.PI),
  };
};

const getRandomVictims = (amount, radius, center, idx) => {
  const points = [];
  for (let i = idx; i < amount; i++) {
    const randomPoint = getRandomLocation(
      center.latitude,
      center.longitude,
      radius
    );
    points.push({
      title: randFullName(),
      id: i.toString(),
      latlng: randomPoint,
      phone: randPhoneNumber(),
      lastSeen: DateTime.fromJSDate(
        randBetweenDate({
          from: DateTime.now().minus({ hours: 5 }),
          to: DateTime.now(),
        })
      ).toRelative(),
      bpm: `${randNumber({ min: 80, max: 150 })} bpm`,
    });
  }

  return points;
};
