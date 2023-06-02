import { useState } from "react";

// UI
import {
  Button,
  Avatar,
  Text,
  IconButton,
  Card,
  RadioButton,
  Modal,
  Divider,
} from "react-native-paper";
import { View, StyleSheet, Text as RnText } from "react-native";

import { useStoreState, useStoreActions } from "easy-peasy";

import { rdb, db } from "@firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref } from "firebase/database";

import { exitLocationShare, sendLocation } from "@utils";

export default function Profile({ navigation }) {
  const { user, location } = useStoreState((s) => s);
  const { setUser, setLocation } = useStoreActions((a) => a);
  const [appMode, setAppMode] = useState(user.mode ?? "Idle");
  const [pendingMode, setPendingMode] = useState(appMode);
  const [loading, isLoading] = useState(false);

  const [confrimModal, setConfirmModal] = useState(false);
  const showModal = () => setConfirmModal(true);
  const hideModal = () => setConfirmModal(false);

  const helmetIcon = require("@assets/helmet.png");

  const confirmationModal = (mode) => {
    setPendingMode(mode);
    showModal();
  };

  const getModeName = (mode) => {
    if (mode === "Idle") {
      return "Calm";
    }
    if (mode === "ProSAR") {
      return "Search and Rescue";
    }
    if (mode === "Independent") {
      return "Volunteer";
    }

    return mode;
  };

  const changeAppMode = async (_) => {
    isLoading(true);
    try {
      const rdbRef = ref(rdb, `volunteers/${user.id}`);
      if (pendingMode !== "Independent" && appMode === "Independent") {
        await exitLocationShare(rdbRef, pendingMode, user);
      } else {
        if (pendingMode === "Independent") {
          await sendLocation(rdbRef, 900000, setLocation, user, location); // Every 15 minutes
        }

        const userDoc = doc(db, "users", user.id);
        await updateDoc(userDoc, { mode: pendingMode }); // change mode
      }

      setUser({ ...user, mode: pendingMode });
      setAppMode(pendingMode);
    } catch (e) {
      console.warn(e);
    } finally {
      isLoading(false);
      hideModal();
      navigation.navigate("Calm");
    }
  };

  // UI
  return (
    <View style={style.layout}>
      <View style={[style.titleCard]}>
        <IconButton
          icon="keyboard-backspace"
          mode="contained-tonal"
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge">Profile Settings</Text>
      </View>

      <View style={[style.profileSection, style.cards]}>
        <View style={style.profilePic}>
          <Avatar.Image size={150} source={require("@assets/lego.png")} />
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

      <View style={[style.settingButtons, style.cards]}>
        <Text variant="titleMedium">Profile Information</Text>
        <Button
          icon="pencil"
          mode="text"
          onPress={() => {
            navigation.navigate("ProfileInfo", { editMode: true });
          }}
        >
          Edit
        </Button>
      </View>

      <View style={[style.settingButtons, style.cards]}>
        <Text variant="titleMedium">Medical Information</Text>
        <Button
          icon="pencil"
          mode="text"
          onPress={() => {
            navigation.navigate("MedicalInfo", { editMode: true });
          }}
        >
          Edit
        </Button>
      </View>

      <View style={[style.profileSection, style.cards]}>
        <Text variant="titleMedium" style={{ width: "100%" }}>
          Application Mode
        </Text>
        <RadioButton.Group onValueChange={confirmationModal} value={appMode}>
          <View style={style.modeCards}>
            <Card
              style={style.modeCard}
              onPress={() => confirmationModal("Idle")}
            >
              <Card.Content>
                <IconButton
                  icon="airplane"
                  size={35}
                  iconColor={appMode == "Idle" ? "#311b92" : "black"}
                />
                <Text style={{ textAlign: "center" }}>Calm</Text>
              </Card.Content>
              <Card.Actions style={{ alignSelf: "center" }}>
                <RadioButton value="Idle" />
              </Card.Actions>
            </Card>

            <Card
              style={style.modeCard}
              onPress={() => confirmationModal("ProSAR")}
            >
              <Card.Content style={{ alignSelf: "center" }}>
                <IconButton
                  icon={{ source: helmetIcon, direction: "auto" }}
                  size={35}
                  iconColor={appMode == "ProSAR" ? "#311b92" : "black"}
                />
                <Text style={{ textAlign: "center" }}>SAR</Text>
              </Card.Content>
              <Card.Actions style={{ alignSelf: "center" }}>
                <RadioButton value="ProSAR" />
              </Card.Actions>
            </Card>

            <Card
              style={style.modeCard}
              onPress={() => {
                confirmationModal("Independent");
              }}
            >
              <Card.Content style={{ alignSelf: "center" }}>
                <IconButton
                  icon="hand-heart"
                  size={35}
                  iconColor={appMode == "Independent" ? "#311b92" : "black"}
                />
                <Text style={{ textAlign: "center" }}>Volunteer</Text>
              </Card.Content>
              <Card.Actions style={{ alignSelf: "center" }}>
                <RadioButton value="Independent" />
              </Card.Actions>
            </Card>
          </View>
        </RadioButton.Group>
      </View>
      <Modal
        visible={confrimModal}
        onDismiss={hideModal}
        contentContainerStyle={style.modal}
      >
        <Text variant="headlineSmall">Change application mode?</Text>
        <Divider />
        <Text>
          Are you sure you want to change the application to
          <RnText style={{ fontWeight: "bold", color: "#311b92" }}>
            {" "}
            {getModeName(pendingMode)}{" "}
          </RnText>
          mode
        </Text>
        {pendingMode === "ProSAR" && (
          <View style={style.warningCard}>
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
              This step will require validation from an official Search and
              Rescue Organization in the future.
            </Text>
          </View>
        )}

        <Button
          icon="check"
          mode="contained"
          style={{
            alignSelf: "flex-end",
          }}
          onPress={changeAppMode}
          loading={loading}
        >
          Save
        </Button>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "white",
    padding: "2%",
  },
  cards: {
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 7,
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
    marginBottom: 10,
    marginTop: -10,
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
  settingButtons: {
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
    padding: "4%",
    backgroundColor: "white",
    gap: 7,
  },
  modeCards: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
  modeCard: {
    flexShrink: 1,
    width: "30%",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    flexBasis: "auto",
    flexShrink: 1,
    gap: 10,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#e6b800",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
