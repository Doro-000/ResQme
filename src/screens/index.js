import AuthStack from "./auth";
import UserStack from "./user";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

import { useEffect, useState } from "react";
import { View, Text } from "react-native";

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
