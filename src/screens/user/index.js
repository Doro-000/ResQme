// React
import React from "react";

// State
import { useStoreState } from "easy-peasy";

// Navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// UI
import { Panic, Calm, ProfileStack, VolunteerHelp } from "./userScreens";
import CustomNavigationBar from "./components/CustomNavigationBar";

const { Navigator, Screen } = createNativeStackNavigator();

export default function UserStack({ hideSplash }) {
  const { user } = useStoreState((s) => s);

  return (
    <NavigationContainer onReady={hideSplash}>
      <Navigator
        initialRouteName={user.mode === "Panic" ? "Panic" : "Calm"}
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}
      >
        <Screen name="Calm" component={Calm} />
        <Screen
          name="Panic"
          component={Panic}
          options={{ headerShown: false }}
        />
        <Screen name="Profile" component={ProfileStack} />
        <Screen name="howTo" component={VolunteerHelp} />
      </Navigator>
    </NavigationContainer>
  );
}
