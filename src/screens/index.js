import AuthStack from "./auth";
import UserStack from "./user";

import { onAuthStateChanged, getAuth } from "firebase/auth";

import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function RootNavigator() {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUid(firebaseUser.uid);
      } else {
        setUid(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return uid ? <UserStack uid={uid} /> : <AuthStack />;
}
