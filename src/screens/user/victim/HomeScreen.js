import { useState, useEffect } from "react";

// UI
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { Audio } from "expo-av";

import Map from "../common/map";

export default function HomeScreen() {
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  async function playSound() {
    setLoading(true);
    const { granted } = await Audio.requestPermissionsAsync();
    console.log(granted);

    if (!granted) {
      setLoading(false);
      setErrorMsg("Permission to play audio was denied");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/SOS_AUDIO.mp3"),
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      setErrorMsg("Couldn't play audio, try again !");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={style.HomeScreen}>
      <View style={style.Content}>
        <Map />
      </View>

      <View style={style.ButtonCard}>
        <Button
          style={style.Button}
          icon="google-maps"
          mode="contained"
          onPress={() => console.log("press")}
        >
          SOS
        </Button>
        <Button
          mode="outlined"
          icon="bell"
          style={style.Button}
          onPress={playSound}
        >
          RING
        </Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  HomeScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Content: {
    width: "98%",
    flex: 0.7,
    marginBottom: "1%",
    borderRadius: 15,
  },
  ButtonCard: {
    width: "98%",
    elevation: 2,
    backgroundColor: "white",
    marginBottom: "2%",
    borderRadius: 15,
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  Button: {
    width: "30%",
  },
});
