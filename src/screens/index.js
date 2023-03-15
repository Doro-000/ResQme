import AuthStack from "./auth";
import UserStack from "./user";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";

export default function RootNavigator() {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUid(firebaseUser.uid);
        setLoading(false);
      } else {
        setUid(null);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <Text>loading...</Text>
      </SafeAreaView>
    );
  }

  return uid ? <UserStack uid={uid} /> : <AuthStack />;
}
