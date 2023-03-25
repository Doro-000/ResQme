import React from "react";

import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Checkbox,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import LottieView from "lottie-react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [isNgo, setNgo] = useState(false);

  const { setUser } = useStoreActions((a) => a);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );

      const id = userCredential.user.uid;

      // get user from collection
      const user = await getDoc(doc(db, "users", id));

      setUser({ ...user.data(), isNgo });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={style.signInView}>
      <Text variant="displayLarge">⛑ ResQme</Text>
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
          marginVertical: 15,
        }}
        source={require("@assets/login.json")}
      />
      <View style={style.formCard}>
        <TextInput
          style={style.formInput}
          mode={"outlined"}
          label={"Email"}
          onChangeText={(input) => setEmail(input)}
          value={email}
        />

        <TextInput
          style={style.formInput}
          mode={"outlined"}
          label={"Password"}
          secureTextEntry={true}
          onChangeText={(input) => setPassword(input)}
          value={pass}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox.Item
            status={isNgo ? "checked" : "unchecked"}
            onPress={() => {
              setNgo(!isNgo);
            }}
            style={{
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
          />
          <Text>SAR team login</Text>
        </View>
        <Button
          style={style.signInButton}
          onPress={handleLogin}
          mode="contained"
          icon="login"
        >
          Login
        </Button>
      </View>
      <Button
        onPress={() => navigation.navigate("signup")}
        style={{
          marginTop: 30,
        }}
      >
        New Here? Sign Up
      </Button>
      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#E8DEF8",
          paddingHorizontal: 5,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <IconButton icon="information" size={15} mode="outlined" />
        <Text
          variant="bodySmall"
          style={{
            flexShrink: 1,
          }}
        >
          Use the information button to learn how to assist the victim & wait
          for the authorites arrive!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  signInView: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formCard: {
    width: "85%",
    rowGap: 3,
  },
  signInButton: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
});
