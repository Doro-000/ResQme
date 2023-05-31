import React from "react";

import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import { Button, TextInput, HelperText, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import LottieView from "lottie-react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");

  const [error, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.warn(error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setErrMsg("Check Your Credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={style.signInView}>
      <Text variant="displayLarge">⛑️ ResQme</Text>
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
        <View>
          <TextInput
            style={style.formInput}
            mode={"outlined"}
            label={"Email"}
            onChangeText={(input) => setEmail(input)}
            value={email}
          />
          <HelperText
            type="error"
            visible={error !== null}
            style={{
              display: error !== null ? "flex" : "none",
            }}
          >
            {error}
          </HelperText>
        </View>

        <View>
          <TextInput
            style={style.formInput}
            mode={"outlined"}
            label={"Password"}
            secureTextEntry={true}
            onChangeText={(input) => setPassword(input)}
            value={pass}
          />
          <HelperText
            type="error"
            visible={error !== null}
            style={{
              display: error !== null ? "flex" : "none",
            }}
          >
            {error}
          </HelperText>
        </View>
        <Button
          style={style.signInButton}
          onPress={handleLogin}
          mode="contained"
          icon="login"
          loading={loading}
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
