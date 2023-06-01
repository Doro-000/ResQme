// React
import { useState } from "react";

// UI
import { View } from "react-native";
import {
  Appbar,
  Modal,
  Portal,
  Text,
  Button,
  Divider,
} from "react-native-paper";
import { StyleSheet } from "react-native";

// State
import { useStoreActions, useStoreState } from "easy-peasy";

// Firebase
import { signOut as fireBaseSignOut } from "firebase/auth";
import { auth, rdb } from "@firebaseConfig";
import { ref } from "firebase/database";

import { exitLocationShare } from "@utils";

const { Header, Content, Action } = Appbar;
export default function CustomNavigationBar({ navigation }) {
  // state
  const [visible, setVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const { user } = useStoreState((s) => s);
  const { logout } = useStoreActions((a) => a);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const showInfoModal = () => setInfoVisible(true);
  const hideInfoModal = () => setInfoVisible(false);

  // funcs
  const signOut = async () => {
    try {
      if (user.mode === "Panic") {
        await exitLocationShare(ref(rdb, `victims/${user.id}`), "Idle", user);
      } else if (user.mode == "Independent") {
        await exitLocationShare(
          ref(rdb, `volunteers/${user.id}`),
          "Idle",
          user
        );
      }

      await fireBaseSignOut(auth);
      logout();
    } catch (error) {
      console.warn(error);
    }
  };

  // UI
  return (
    <Header elevated>
      <Content
        title="⛑️ ResQme"
        onPress={() => {
          navigation.navigate("Calm");
        }}
      />
      <Action icon="information" onPress={showInfoModal} color="#600D75" />
      <Action
        icon="account"
        onPress={() => navigation.navigate("Profile", { screen: "Default" })}
      />
      <Action icon="logout" onPress={showModal} color="#a81c06" />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall">Log out</Text>
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

      <Portal>
        <Modal
          visible={infoVisible}
          onDismiss={hideInfoModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall">Info</Text>
          <Divider />
          <Text variant="bodySmall">
            ⚒️ Built for the Google Solution Challenge 2023.
          </Text>
          <Text variant="bodySmall">
            ⚠️ Includes random data for demo purposes !
          </Text>
          <Text variant="bodySmall">
            ℹ️ Switch Context (Victim / Search and Rescue) in the profile tab.
          </Text>
          <Divider />
          <Text
            variant="bodySmall"
            style={{
              marginTop: 10,
              textAlign: "right",
            }}
          >
            Made with ❤️ in Bremen.
          </Text>
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
    marginTop: 20,
    flexBasis: "auto",
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 3,
  },
});
