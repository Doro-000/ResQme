import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Checkbox,
  IconButton,
  HelperText,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import LottieView from "lottie-react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@firebaseConfig";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPassword] = useState("");
  const [phoneNum, setPhoneNumber] = useState("");

  const [error, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const setUser = useStoreActions((actions) => actions.setUser);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );

      const id = userCredential.user.uid;

      const user = {
        name,
        email,
        id,
        phoneNum,
        mode: "Idle",
      };

      // Add to users collection
      await setDoc(doc(collection(db, "users"), id), user);
      setUser(user);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrMsg("Email already in use !");
      } else if (error.code === "auth/invalid-email") {
        setErrMsg("Invalid Email !");
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
        <TextInput
          mode={"outlined"}
          label={"Password"}
          secureTextEntry={true}
          onChangeText={(input) => setPassword(input)}
          value={pass}
        />
        <TextInput
          mode={"outlined"}
          label={"Name"}
          onChangeText={(input) => setName(input)}
          value={name}
        />
        <TextInput
          label={"Phone Number"}
          mode={"outlined"}
          keyboardType="numeric"
          onChangeText={(number) => setPhoneNumber(number)}
          value={phoneNum}
          maxLength={15}
        />
        <Button
          style={style.signInButton}
          onPress={handleSignUp}
          mode="contained"
          icon="login"
          loading={loading}
        >
          Sign Up !
        </Button>
      </View>
      <Button
        onPress={() => navigation.navigate("login")}
        style={{
          marginTop: 30,
        }}
      >
        Already have an account? Login
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
