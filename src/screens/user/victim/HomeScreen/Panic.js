import { useState, useEffect } from "react";

import { Audio } from "expo-av";

import { FAB, Text, Banner } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Location from "expo-location";
import { useStoreActions, useStoreState } from "easy-peasy";

import { geoFire } from "../../../../../firebaseConfig";

export default function Panic({ navigation }) {
  const [sound, setSound] = useState(null);
  const [_, setErrorMsg] = useState(null);

  const setLocation = useStoreActions((actions) => actions.setLocation);
  const location = useStoreState((state) => state.location);

  const user = useStoreState((state) => state.user);

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
    await geoFire.set(user.id, [location.latitude, location.longitude]);

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced, // foreground location update
        timeInterval: 30000, // every 3 minutes
      },
      async (location) => {
        setLocation(location.coords);

        // update every 3 minutes
        await geoFire.set(user.id, [
          location.coords.latitude,
          location.coords.longitude,
        ]);
      }
    );
  }

  async function exitPanic() {
    await geoFire.remove(user.id); // stop tracking on panic exit

    navigation.navigate("Calm");
  }

  useEffect(() => {
    sendLocation();
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
        <View>
          <Text>Help is on the way...</Text>
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
