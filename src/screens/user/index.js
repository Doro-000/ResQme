import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import { Panic, Calm } from "./victim/HomeScreen";
import CustomNavigationBar from "./common/CustomNavigationBar";
import Profile from "./common/Profile";

const { Navigator, Screen } = createNativeStackNavigator();

export default function UserStack({ uid }) {
  const setUser = useStoreActions((actions) => actions.setUser);

  const getUserInfo = async (uid) => {
    const userDoc = doc(db, "users", uid);
    const userInfo = await getDoc(userDoc);
    setUser(userInfo.data());
  };

  useEffect(() => {
    getUserInfo(uid);
  }, [uid]);

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="Calm"
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
