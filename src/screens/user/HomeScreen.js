import { useState } from "react";

// UI
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

// STORE
import { useStoreState, useStoreActions } from "easy-peasy";

// LOCATION
import * as Location from "expo-location";

export default function HomeScreen() {
  const setLocation = useStoreActions((actions) => actions.setLocation);
  const location = useStoreState((state) => state.getLocationText);

  const user = useStoreState((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    setLoading(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoading(false);
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMsg("Couldn't fetch Location, try again !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.HomeScreen}>
      <View style={style.Content}>
        <Text>{JSON.stringify(user)}</Text>
        <Text> Press the Button to fetch location ! </Text>
        <Text>{loading ? "Loading..." : location || errorMsg}</Text>
      </View>
      <View style={style.ButtonCard}>
        <Button
          style={style.Button}
          icon="google-maps"
          mode="contained"
          onPress={getLocation}
        >
          SOS
        </Button>
        <Button mode="outlined" icon="bell" style={style.Button}>
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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
