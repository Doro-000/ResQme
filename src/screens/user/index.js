// React
import React from "react";

// State
import { useStoreState } from "easy-peasy";

// Navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// UI
import { Panic, Calm, Profile, MedicalInfo } from "./userScreens";
import CustomNavigationBar from "./components/CustomNavigationBar";

const { Navigator, Screen } = createNativeStackNavigator();

// UTIL
import { isEmpty } from "lodash";

export default function UserStack({ hideSplash }) {
  const { user, medicalInfo } = useStoreState((s) => s);
  let initialRouteName = "Calm";

  if (user.panicMode) {
    initialRouteName = "Panic";
  } else {
    if (isEmpty(medicalInfo)) {
      initialRouteName = "MedicalInfo";
    }
  }

  return (
    <NavigationContainer onReady={hideSplash}>
      <Navigator
        initialRouteName={initialRouteName}
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
        <Screen name="MedicalInfo" component={MedicalInfo} />
      </Navigator>
    </NavigationContainer>
  );
}
