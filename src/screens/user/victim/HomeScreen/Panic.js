import { useState, useEffect } from "react";

import { Audio } from "expo-av";

import { FAB, Text, Banner } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Panic({ navigation }) {
  const [sound, setSound] = useState(null);
  const [_, setErrorMsg] = useState(null);

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
          onPress={() => navigation.navigate("Calm")}
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
