// React
import React from "react";

// Navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// UIr
import Profile from "./Profile";
import MedicalInfo from "./MedicalInfo";
import ProfileInfo from "./ProfileInfo";

const { Navigator, Screen } = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Navigator
      initialRouteName={"Default"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Default" component={Profile} />
      <Screen name="ProfileInfo" component={ProfileInfo} />
      <Screen name="MedicalInfo" component={MedicalInfo} />
    </Navigator>
  );
}
