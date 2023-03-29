import React from "react";
import { useStoreState } from "easy-peasy";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { Panic, Calm, Profile } from "./userScreens";
import CustomNavigationBar from "./components/CustomNavigationBar";

const { Navigator, Screen } = createNativeStackNavigator();

export default function UserStack({ hideSplash }) {
  const { user } = useStoreState((s) => s);

  return (
    <NavigationContainer onReady={hideSplash}>
      <Navigator
        initialRouteName={user.panicMode ? "Panic" : "Calm"}
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
        <Screen name="Profile" component={Profile} />
      </Navigator>
    </NavigationContainer>
  );
}
