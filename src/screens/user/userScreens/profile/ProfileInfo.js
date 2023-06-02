import React from "react";

// React
import { useState } from "react";

// UI
import { Button, TextInput, Text, IconButton } from "react-native-paper";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

// STATE
import { useStoreState, useStoreActions } from "easy-peasy";

// Firebase
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@firebaseConfig";

export default function ProfileInfo({ route, navigation }) {
  const { user } = useStoreState((s) => s);
  const { setUser } = useStoreActions((a) => a);
  const { editMode } = route.params;

  // FORM STATE
  const [isEditing, setEditing] = useState(editMode ?? false);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [phoneNum, setPhoneNumber] = useState(user.phoneNum);
  const [loading, setLoading] = useState(false);

  const height = useHeaderHeight();

  // FUNCS
  const toggleEdit = () => {
    setEditing(!isEditing);
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = {
        email,
        name,
        phoneNum,
      };

      const userDoc = doc(db, "users", user.id);
      await updateDoc(userDoc, updatedUser);

      setUser({ ...updatedUser, id: user.id });
      toggleEdit();

      navigation.navigate("Calm");
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        style={style.layout}
        keyboardVerticalOffset={height}
        behavior="padding"
        enabled
      >
        {/* Title */}
        <View style={style.titleCard}>
          <IconButton
            icon="keyboard-backspace"
            mode="contained-tonal"
            onPress={() => navigation.goBack()}
          />
          <Text variant="titleLarge">Profile Information</Text>
        </View>

        <View style={[style.profileSection, style.cards]}>
          <TextInput
            mode={"outlined"}
            label={"Email"}
            onChangeText={(input) => setEmail(input)}
            disabled={!isEditing}
            value={email}
          />
          <TextInput
            mode={"outlined"}
            label={"Name"}
            onChangeText={(input) => setName(input)}
            disabled={!isEditing}
            value={name}
          />
          <TextInput
            label={"Phone Number"}
            mode={"outlined"}
            keyboardType="numeric"
            onChangeText={(number) => setPhoneNumber(number)}
            disabled={!isEditing}
            value={phoneNum}
            maxLength={15}
          />
        </View>

        {isEditing ? (
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignSelf: "flex-end",
            }}
          >
            <Button
              icon="check-bold"
              mode="contained"
              onPress={updateProfile}
              loading={loading}
            >
              Save
            </Button>
            <Button icon="cancel" mode="text" onPress={toggleEdit}>
              cancel
            </Button>
          </View>
        ) : (
          <Button
            icon="pencil"
            mode="contained"
            onPress={toggleEdit}
            style={{
              alignSelf: "flex-end",
            }}
          >
            Edit
          </Button>
        )}
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
  titleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "center",
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
    width: "100%",
    padding: "4%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
    marginBottom: 5,
    marginTop: -10,
  },
});
