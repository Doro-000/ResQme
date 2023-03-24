import React, { useState } from "react";

import { View } from "react-native";
import {
  Appbar,
  Modal,
  Portal,
  Text,
  Button,
  Divider,
} from "react-native-paper";

import { StackActions } from "@react-navigation/native";

import { useStoreActions } from "easy-peasy";

import { StyleSheet } from "react-native";
import { signOut as fireBaseSignOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

const { Header, Content, Action } = Appbar;

export default function CustomNavigationBar({ navigation }) {
  const [visible, setVisible] = useState(false);
  const { logout } = useStoreActions((a) => a);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const signOut = async () => {
    try {
      await fireBaseSignOut(auth);
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Header elevated>
      <Content
        title="⛑ ResQme"
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.dispatch(StackActions.popToTop());
          }
        }}
      />
      <Action
        icon="account"
        onPress={() => navigation.navigate("Profile")}
        color=""
      />
      <Action icon="logout" onPress={showModal} color="#a81c06" />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineLarge">Log out?</Text>
          <Divider />
          <Text>Are you sure you want to log out ?</Text>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={hideModal}>
              Cancel
            </Button>
            <Button onPress={signOut}>Log out</Button>
          </View>
        </Modal>
      </Portal>
    </Header>
  );
}

styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    flexBasis: "auto",
    flexShrink: 1,
    gap: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexBasis: "auto",
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 3,
  },
});
