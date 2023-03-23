import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

import { useStoreState } from "easy-peasy";

const VictimDetail = () => {
  const { bottomSheetActive } = useStoreState((state) => state);

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={bottomSheetActive ? 1 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
    >
      <View style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default VictimDetail;
