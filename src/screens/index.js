// REACT
import { useCallback, useEffect, useState } from "react";

// Navigation stacks
import AuthStack from "./auth";
import UserStack from "./user";

// EXPO
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// State
import { useStoreActions } from "easy-peasy";

SplashScreen.preventAutoHideAsync();
export default function RootNavigator() {
  // state
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState("Idle");
  const [uid, setUid] = useState(null);
  const [setErrorMsg] = useState(null);

  const { setPermissions, setLocation, setUser, setMedicalInfo } =
    useStoreActions((a) => a);

  // funcs
  const getUserInfo = async (uid) => {
    const userDoc = doc(db, "users", uid);
    const userInfo = await getDoc(userDoc);
    setUser(userInfo.data());

    const medicalDoc = doc(db, "userMedicalInfo", uid);
    const medicalInfo = (await getDoc(medicalDoc)).data();
    setMedicalInfo(medicalInfo ?? {});
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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // UI
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
