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

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPassword] = useState("");

  const [isNgo, setNgo] = useState(false);

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
        isNgo,
      };

      // Add to users collection
      await setDoc(doc(collection(db, "users"), id), user);

      setUser(user);
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
          onChangeText={(input) => setName(input)}
          value={name}
        ></TextInput>
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
          onPress={handleSignUp}
          mode="contained"
          icon="login"
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
