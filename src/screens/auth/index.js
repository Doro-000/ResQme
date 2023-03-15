import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import SignInScreen from "./SignInScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen
          name="signIn"
          component={SignInScreen}
          options={{ title: "Welcome!" }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
