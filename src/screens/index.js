// REACT
import { useCallback, useEffect, useState } from "react";

import AuthStack from "./auth";
import UserStack from "./user";

import * as SplashScreen from "expo-splash-screen";

import * as Location from "expo-location";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@firebaseConfig";

import { useStoreActions } from "easy-peasy";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@firebaseConfig";

SplashScreen.preventAutoHideAsync();
export default function RootNavigator() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState("Idle");
  const [uid, setUid] = useState(null);
  const [setErrorMsg] = useState(null);

  const { setPermissions, setLocation, setUser } = useStoreActions((a) => a);

  const getUserInfo = async (uid) => {
    const userDoc = doc(db, "users", uid);
    const userInfo = await getDoc(userDoc);
    setUser(userInfo.data());
  };

  const getLocation = async () => {
    const { granted: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    setPermissions(foregroundStatus);

    if (!foregroundStatus) {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // for inital location
      });
      setLocation(location.coords);
    } catch (error) {
      setErrorMsg("Couldn't fetch Location, try again !");
    }
  };

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUid(firebaseUser.uid);
      setIsAuthed("Authed");
    } else {
      setUid(null);
      setIsAuthed("notAuthed");
    }
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (uid !== null) {
          await getUserInfo(uid);
        }
        await getLocation();
      } catch (e) {
        console.warn(e);
      } finally {
        if (isAuthed !== "Idle") {
          setAppIsReady(true);
        }
      }
    }

    prepare();
  }, [isAuthed]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      {isAuthed === "Authed" ? (
        <UserStack hideSplash={onLayoutRootView} />
      ) : (
        <AuthStack hideSplash={onLayoutRootView} />
      )}
    </>
  );
}
