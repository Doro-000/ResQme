import React from "react";

import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  HelperText,
  Text,
  Checkbox,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import LottieView from "lottie-react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [isNgo, setNgo] = useState(false);

  const { setUser, setMedicalInfo } = useStoreActions((a) => a);

  const [error, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );

      const id = userCredential.user.uid;

      // get user from collection
      const userDoc = doc(db, "users", id);
      await updateDoc(userDoc, {
        isNgo,
      });

      // get user medical information.
      const medicalDoc = doc(db, "medInfo", id);

      const user = await getDoc(userDoc);
      const medicalInfo = await getDoc(medicalDoc);

      setUser(user.data());
      setMedicalInfo(medicalInfo.data() ?? {});
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
        {isNgo && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#e6b800",
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <IconButton
              icon="information"
              size={15}
              mode="outlined"
              iconColor="black"
            />
            <Text
              variant="bodySmall"
              style={{
                flexShrink: 1,
              }}
            >
              This option presents the App from a SAR team member's perspective.
            </Text>
          </View>
        )}
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
