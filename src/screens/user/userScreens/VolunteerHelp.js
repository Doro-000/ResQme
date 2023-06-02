import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import PDFReader from "rn-pdf-reader-js";

export default function VolunteerHelp() {
  const uri =
    "https://reliefweb.int/attachments/d1105028-c9f1-4b61-a7ba-e7cca9796ba2/Do%27s%20and%20Don%27ts%20for%20Volunteers%20-%20Tip%20Sheet%20%28March%202023%29.pdf";

  return (
    <View style={styles.container}>
      <PDFReader source={{ uri }} style={styles.pdf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
