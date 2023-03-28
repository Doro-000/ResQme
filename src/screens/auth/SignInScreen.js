import { useState, useRef } from "react";
import { useStoreActions } from "easy-peasy";

import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import PhoneInput from "react-native-phone-number-input";

import LottieView from "lottie-react-native";

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pass, setPassword] = useState("");

  // const phoneInput = useRef<PhoneInput>(null);
  const [isNgo, setNgo] = useState(false);

  const setUser = useStoreActions((actions) => actions.setUser);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );

      // implement a popup for the function below to say that the email has been sent
      // the verification email has been sent succesfully
      await sendEmailVerification(
        userCredential.user
      ).then(() => {
        alert('The verification email sent succesfully!');
      });

      const id = userCredential.user.uid;

      const user = {
        firstName,
        lastName,
        email,
        phoneNum,
        id,
      };

      // Add to users collection
      await setDoc(doc(collection(db, "users"), id), user);

      setUser({ ...user, isNgo });
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
          label={"First Name"}
          onChangeText={(input) => setFirstName(input)}
          value={firstName}
        ></TextInput>
        <TextInput
          style={style.formInput}
          mode={"outlined"}
          label={"Last Name"}
          onChangeText={(input) => setLastName(input)}
          value={lastName}
        ></TextInput>
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

        <PhoneInput
          mode={"outlined"}
          label={"Phone Number"}
          defaultCode='DE'
          secureTextEntry={true}
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNum}
        ></PhoneInput>
        
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



