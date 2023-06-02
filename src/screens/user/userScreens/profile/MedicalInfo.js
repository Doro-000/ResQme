import React, { useState, useCallback, useMemo } from "react";

// UI
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  StyleSheet,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  IconButton,
  Text,
  TextInput,
  RadioButton,
  Divider,
  Button,
  Checkbox,
} from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { MaskedTextInput } from "react-native-mask-text";

// STATE
import { useStoreState, useStoreActions } from "easy-peasy";

// FIREBASE
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@firebaseConfig";
import { isEmpty } from "lodash";

export default function MedicalInfo({ route, navigation }) {
  const { user, medicalInfo } = useStoreState((s) => s);
  const { setMedicalInfo } = useStoreActions((a) => a);
  const { editMode } = route.params;

  // UI
  const headerHeight = useHeaderHeight();

  // STATE
  const [isEditing, setEditing] = useState(editMode ?? false);
  const [loading, setLoading] = useState(false);

  // FORM VALUES
  const [selectedBlood, setBlood] = useState(medicalInfo.selectedBlood ?? "");
  const [birthDate, setBDay] = useState(
    new Date(medicalInfo.birthdate ?? Date.now())
  );
  const [height, setHeight] = useState(
    medicalInfo.height ? medicalInfo.height.toString() : ""
  );
  const [weight, setWeight] = useState(
    medicalInfo.weight ? medicalInfo.weight.toString() : ""
  );
  const [gender, setGender] = useState(medicalInfo.gender ?? "");

  const [allergies, setAllergies] = useState(medicalInfo.allergies ?? "");
  const [currentMedications, setCurrentMedications] = useState(
    medicalInfo.currentMedications ?? ""
  );
  const [medicalConditions, setMedicalConditions] = useState(
    medicalInfo.medicalConditions ?? ""
  );
  const [organDonor, setOrganDonor] = useState(medicalInfo.organDonor ?? false);

  const bloodTypes = useMemo(
    () =>
      ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type, idx) => {
        return {
          key: idx,
          value: type,
        };
      }),
    []
  );

  // FUNCS
  const toggleEdit = () => {
    setEditing(!isEditing);
  };

  const updateMedicalInfo = async () => {
    try {
      setLoading(true);

      // hotfix
      const bloodT =
        bloodTypes[
          bloodTypes.findIndex(
            (el) => el.value == selectedBlood || el.key == selectedBlood
          )
        ].value;

      const medicalInfo = {
        selectedBlood: bloodT,
        birthDate,
        height: parseFloat(height),
        weight: parseFloat(weight),
        gender,
        allergies,
        currentMedications,
        medicalConditions,
        organDonor,
      };

      await setDoc(
        doc(collection(db, "userMedicalInfo"), user.id),
        medicalInfo
      );

      setMedicalInfo(medicalInfo);
      toggleEdit();

      navigation.navigate("Profile");
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const onChange = useCallback(
    (_, selectedDate) => {
      const currentDate = selectedDate;
      setBDay(currentDate);
    },
    [setBDay]
  );

  const openDatePicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: birthDate,
      onChange,
      mode: "date",
    });
  }, []);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={style.layout}
        keyboardVerticalOffset={headerHeight}
        behavior="padding"
      >
        {/* Title */}
        <View style={style.titleCard}>
          <IconButton
            icon="keyboard-backspace"
            mode="contained-tonal"
            onPress={() => navigation.goBack()}
          />
          <Text variant="titleLarge">Medical Information</Text>
        </View>

        {/* Warning */}
        {isEmpty(medicalInfo) && (
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
              To assist rescuers in providing the most effective help, kindly
              provide your medical information.
            </Text>
          </View>
        )}

        <View style={[style.cards, style.profileSection]}>
          {/* Blood Types */}
          <View>
            <Text variant="titleMedium">Blood Type</Text>
            <SelectList
              defaultOption={
                bloodTypes[
                  bloodTypes.findIndex(
                    (el) => el.value == selectedBlood || el.key == selectedBlood
                  )
                ]
              }
              enabled={isEditing}
              setSelected={setBlood}
              data={bloodTypes}
              save="value"
              boxStyles={{
                borderColor: isEditing ? "#000" : "#e0e0e0",
              }}
              inputStyles={{
                color: isEditing ? "#000" : "#bdbdbd",
              }}
            />
          </View>

          {/* BirthDay */}
          <View>
            <Text variant="titleMedium">BirthDay</Text>
            <View
              style={{
                flex: 1,
                gap: 5,
                flexDirection: "row",
              }}
            >
              <TextInput
                editable={false}
                disabled={!isEditing}
                value={birthDate.toDateString()}
                mode="outlined"
                style={{
                  flexGrow: 1,
                }}
              />
              <IconButton
                disabled={!isEditing}
                icon="calendar"
                mode="contained"
                size={25}
                style={{
                  alignSelf: "flex-end",
                  borderRadius: 5,
                }}
                onPress={openDatePicker}
              />
            </View>
          </View>

          <Divider />

          {/* Height and weight*/}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 25,
            }}
          >
            <View
              style={{
                flexGrow: 1,
              }}
            >
              <TextInput
                label={"Height"}
                placeholder="Height in Meter"
                mode={"outlined"}
                keyboardType="numeric"
                onChangeText={(height) => setHeight(height)}
                value={height}
                render={(props) => <MaskedTextInput {...props} mask="9.99" />}
                disabled={!isEditing}
              />
            </View>
            <View
              style={{
                flexGrow: 1,
              }}
            >
              <TextInput
                label={"Weight"}
                placeholder="Weight in KG"
                mode={"outlined"}
                keyboardType="numeric"
                onChangeText={(weight) => setWeight(weight)}
                value={weight}
                disabled={!isEditing}
              />
            </View>
          </View>

          <Divider />

          {/* Gender */}
          <View>
            <Text variant="titleMedium">Gender</Text>
            <RadioButton.Group
              onValueChange={(gender) => setGender(gender)}
              value={gender}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <View>
                  <RadioButton value="male" disabled={!isEditing} />
                  <Text>Male</Text>
                </View>
                <View>
                  <RadioButton value="female" disabled={!isEditing} />
                  <Text>Female</Text>
                </View>
                <View>
                  <RadioButton value="other" disabled={!isEditing} />
                  <Text>Other</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <Divider />

          {/* Other conditions */}
          <View>
            <TextInput
              multiline
              label={"Allergies"}
              mode="outlined"
              placeholder="Please state any allergies you have."
              value={allergies}
              onChangeText={(text) => setAllergies(text)}
              disabled={!isEditing}
            />
          </View>

          <View>
            <TextInput
              label={"Current Medications"}
              multiline
              mode="outlined"
              placeholder="Please state any medications you are taking."
              value={currentMedications}
              onChangeText={(text) => setCurrentMedications(text)}
              disabled={!isEditing}
            />
          </View>

          <View>
            <TextInput
              label={"Medical Conditions"}
              multiline
              mode="outlined"
              placeholder="Please state any medical conditions you have."
              value={medicalConditions}
              onChangeText={(text) => setMedicalConditions(text)}
              disabled={!isEditing}
            />
          </View>
          <View>
            <Checkbox.Item
              disabled={!isEditing}
              label="Organ Donor"
              status={organDonor ? "checked" : "unchecked"}
              onPress={() => {
                setOrganDonor(!organDonor);
              }}
            />
          </View>
          <Divider />
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
                onPress={updateMedicalInfo}
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
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  layout: {
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
  profileSection: {
    alignSelf: "center",
    borderRadius: 8,
    width: "100%",
    padding: "4%",
    backgroundColor: "white",
    gap: 10,
  },
  profileInfoHeader: {
    flex: 1,
    gap: 10,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
