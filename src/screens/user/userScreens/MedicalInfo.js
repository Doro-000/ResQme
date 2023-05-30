import React, { useState } from "react";

// UI
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  StyleSheet,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function MedicalInfo() {
  // UI
  const headerHeight = useHeaderHeight();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setBDay(currentDate);
  };

  // STATE
  const [open, setOpen] = useState(false);

  // FORM VALUES
  const [selectedBlood, setBlood] = useState("");
  const [birthDate, setBDay] = useState(new Date());
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
    (type, idx) => {
      return { key: idx, value: type };
    }
  );
  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={style.layout}
        keyboardVerticalOffset={headerHeight}
        behavior="padding"
        enabled
      >
        {/* Blood Types */}
        <SelectList
          setSelected={(val) => setBlood(val)}
          data={bloodTypes}
          save="value"
        />

        {/* BirthDay */}
        <View>
          <Button
            onPress={() => {
              DateTimePicker.open({
                value: birthDate,
                onChange,
                mode: "date",
              });
            }}
          >
            Open
          </Button>
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
});
