import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

import LottieView from "lottie-react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPassword] = useState("");

  const setUser = useStoreActions((actions) => actions.setUser);

  const handleSignUp = async () => {
    try {
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
      };

      // Add to users collection
      await setDoc(doc(collection(db, "users"), id), user);

      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={style.signInView}>
      <View style={style.logo}>
        <LottieView
          autoPlay
          style={{
            width: 300,
            height: 300,
          }}
          source={require("../../assets/login.json")}
        />
      </View>
      <View style={style.formCard}>
        <TextInput
          style={style.formInput}
          mode={"outlined"}
          label={"Email"}
          placeholder={"Email"}
          onChangeText={(input) => setEmail(input)}
          value={email}
        ></TextInput>
        <TextInput
          style={style.formInput}
          mode={"outlined"}
          label={"Password"}
          secureTextEntry={true}
          onChangeText={(input) => setPassword(input)}
          value={pass}
        ></TextInput>
        <TextInput
          style={style.formInput}
          mode={"outlined"}
          label={"Name"}
          placeholder={"Your name"}
          onChangeText={(input) => setName(input)}
          value={name}
        ></TextInput>

        <Button
          style={style.googleSignInButton}
          onPress={handleSignUp}
          mode="contained"
          icon="login"
        >
          Login
        </Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  signInView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    flex: 1,
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 500,
    height: 500,
    resizeMode: "cover",
  },
  formCard: {
    flex: 1,
    width: "85%",
    rowGap: 3,
  },

  googleSignInButton: {
    backgroundColor: "#05668D",
    marginTop: 20,
    alignSelf: "flex-end",
  },
});
