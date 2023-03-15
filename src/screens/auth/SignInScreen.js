import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

import Svg, { Path } from "react-native-svg";

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
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          width="200"
          height="200"
        >
          <Path
            fill="#05668D"
            d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h32V32H64zm64 0v448h320V32H128zm384 448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64h-32v448h32zM256 176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-48v48c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-48h-48c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16h48v-48z"
          />
        </Svg>
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
