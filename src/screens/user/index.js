import React, { useEffect } from "react";
import { useStoreActions } from "easy-peasy";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import HomeScreen from "./HomeScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthStack({ uid }) {
  const setUser = useStoreActions((actions) => actions.setUser);

  useEffect(() => {
    const getUserInfo = async (uid) => {
      const userDoc = doc(db, "users", uid);
      const userInfo = await getDoc(userDoc);
      setUser(userInfo.data());
    };
    getUserInfo(uid);
  }, [uid]);

  return (
    <NavigationContainer>
      <Navigator>
        <Screen name="Home" component={HomeScreen} />
      </Navigator>
    </NavigationContainer>
  );
}
