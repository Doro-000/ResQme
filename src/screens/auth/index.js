import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import SignUpScreen from "./SignInScreen";
import LoginScreen from "./LoginScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={"login"}
      >
        <Screen name="signup" component={SignUpScreen} />
        <Screen name="login" component={LoginScreen} />
      </Navigator>
    </NavigationContainer>
  );
}
