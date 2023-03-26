import { useEffect, useState } from "react";

import { Button, Avatar, TextInput, Text } from "react-native-paper";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import { useStoreState, useStoreActions } from "easy-peasy";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@firebaseConfig";

export default function Profile() {
  const { user } = useStoreState((s) => s);
  const { setUser } = useStoreActions((a) => a);

  const [isEditing, setEditing] = useState(false);
  const height = useHeaderHeight();

  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [isNgo, setIsNgo] = useState(user.isNgo);

  const toggleEdit = () => {
    setEditing(!isEditing);
  };

  const updateProfile = async () => {
    const updatedUser = {
      email,
      name,
      isNgo,
    };

    const userDoc = doc(db, "users", user.id);
    await updateDoc(userDoc, updatedUser);

    setUser({ ...updatedUser, id: user.id });
    toggleEdit();
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={style.layout}
        keyboardVerticalOffset={height}
        behavior="padding"
        enabled
      >
        <View style={[style.profileSection, style.cards]}>
          <View style={style.profilePic}>
            <Avatar.Image size={200} source={require("@assets/lego.png")} />
          </View>
          <Button
            icon="camera"
            mode="text"
            onPress={() => {}}
            style={style.profilePicButton}
          >
            Change Profile Picture
          </Button>
        </View>
        <View style={[style.profileSection, style.cards]}>
          <View style={style.profileInfoHeader}>
            <Text>Profile Information</Text>
            {isEditing ? (
              <Button icon="check-bold" mode="text" onPress={updateProfile}>
                Save
              </Button>
            ) : (
              <Button icon="pencil" mode="text" onPress={toggleEdit}>
                Edit
              </Button>
            )}
          </View>
          <TextInput
            style={style.formInput}
            mode={"outlined"}
            label={"Email"}
            onChangeText={(input) => setEmail(input)}
            disabled={!isEditing}
            value={email}
          ></TextInput>
          <TextInput
            style={style.formInput}
            mode={"outlined"}
            label={"Name"}
            onChangeText={(input) => setName(input)}
            disabled={!isEditing}
            value={name}
          ></TextInput>

          <View
            style={{
              paddingHorizontal: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text>SAR Mode</Text>
            <Switch
              value={isNgo}
              onValueChange={() => {
                setIsNgo(!isNgo);
              }}
              disabled={!isEditing}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "white",
    gap: 5,
    padding: "2%",
  },
  cards: {
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 12,
  },
  profileSection: {
    alignSelf: "center",
    borderRadius: 8,
    width: "100%",
    padding: "4%",
    backgroundColor: "white",
    gap: 7,
  },
  profilePicButton: {
    alignSelf: "center",
  },
  profilePic: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 2,
    borderColor: "#05668D",
    alignSelf: "center",
  },
  profileInfoHeader: {
    flex: 1,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
