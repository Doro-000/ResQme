// React
import { useState, useEffect, useRef } from "react";

// EXPO
import { Audio } from "expo-av";
import * as Location from "expo-location";

// UI
import { FAB, Text, Banner, IconButton } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";

// State
import { useStoreActions, useStoreState } from "easy-peasy";

// Firebase
import { ref, set, update, remove } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";
import { rdb, db } from "@firebaseConfig";

// Utils
import { pick } from "lodash";
import { DateTime } from "luxon";

export default function Panic({ navigation }) {
  // State
  const [sound, setSound] = useState(null);
  const [_, setErrorMsg] = useState(null);
  const { user, location } = useStoreState((s) => s);
  const { setUser, setLocation } = useStoreActions((a) => a);

  // constants
  const rdbRef = ref(rdb, `locations/${user.id}`);
  const userDoc = doc(db, "users", user.id);

  const helpImages = [
    require("@assets/victimPage1.jpeg"),
    require("@assets/victimPage2.jpeg"),
    require("@assets/victimPage3.jpeg"),
    require("@assets/victimPage4.jpeg"),
  ];

  // funcs
  async function playSound() {
    const { granted } = await Audio.requestPermissionsAsync();

    if (!granted) {
      setErrorMsg("Permission to play audio was denied");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@assets/SOS_AUDIO.mp3"),
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      setErrorMsg("Couldn't play audio, try again !");
    }
  }

  async function sendLocation() {
    // set initial location
    await set(rdbRef, {
      ...pick(user, ["id", "name"]),
      latlng: [location.latitude, location.longitude],
      lastSeen: DateTime.now().valueOf(),
    });

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced, // foreground location update
        timeInterval: 30000, // every 3 minutes
      },
      async (location) => {
        setLocation(location.coords);

        // update every 3 minutes
        await update(rdbRef, {
          latlng: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }
    );
  }

  async function setPanicMode() {
    await updateDoc(userDoc, { panicMode: true });
    setUser({ ...user, panicMode: true });
  }

  async function exitPanic() {
    await remove(rdbRef); // stop tracking on panic exit

    const userDoc = doc(db, "users", user.id); // turn off panic mode
    await updateDoc(userDoc, { panicMode: false });

    setUser({ ...user, panicMode: false });

    navigation.navigate("Calm");
  }

  const renderCarouselImage = (value, index) => {
    return (
      <View
        style={{
          shadowColor: "black",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          paddingTop: 10,
          elevation: 5,
          marginBottom: 12,
          borderRadius: 50,
        }}
      >
        <Image
          source={value.item}
          style={{
            borderRadius: 50,
            borderWidth: 5,
            backgroundColor: "white",
            resizeMode: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    );
  };

  // UI
  useEffect(() => {
    sendLocation();
    setPanicMode();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Banner visible={true} icon={"information"}>
        <Text
          variant="titleMedium"
          style={{
            lineHeight: 40,
          }}
        >
          Sharing your location...
        </Text>
      </Banner>
      <View style={style.content}>
        <View
          style={{
            height: "70%",
            marginBottom: "auto",
            marginTop: "10%",
            gap: 15,
          }}
        >
          <Carousel
            data={helpImages}
            renderItem={renderCarouselImage}
            sliderWidth={375}
            itemWidth={300}
            loop
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              backgroundColor: "#e6b800",
              paddingHorizontal: 35,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <IconButton
              icon="information"
              size={15}
              mode="outlined"
              iconColor="black"
            />
            <Text
              variant="bodySmall"
              style={{
                flexShrink: 1,
              }}
            >
              Help is on the way !
            </Text>
          </View>
        </View>
        <FAB
          icon={"bell-alert"}
          onPress={playSound}
          customSize={80}
          style={[style.fabStyle, style.ringStyle]}
        />
        <FAB
          icon={"location-exit"}
          onPress={exitPanic}
          variant="tertiary"
          customSize={80}
          style={[style.fabStyle, style.exitStyle]}
        />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fabStyle: {
    bottom: 50,
    position: "absolute",
  },
  ringStyle: {
    right: 40,
  },
  exitStyle: {
    left: 40,
  },
});
