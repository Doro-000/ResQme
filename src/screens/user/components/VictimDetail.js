// React
import { useCallback, useEffect, useMemo, useState } from "react";

// UI
import { View, StyleSheet, Linking, Image } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Text,
  Avatar,
  Button,
  IconButton,
  Modal,
  Portal,
} from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";

// State
import { useStoreState } from "easy-peasy";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, funcs } from "@firebaseConfig";

// Utils
import { DateTime } from "luxon";
import { isEmpty } from "lodash";
import { randNumber } from "@ngneat/falso";

const VictimDetail = ({
  bottomSheetRef,
  victimData,
  sampleVictim,
  changeBottomSheetActive,
  backDrop,
}) => {
  // State
  const [victim, setVictim] = useState(null);
  const [loading, setLoading] = useState(null);
  const [helpModal, setHelpModal] = useState(false);

  const { user } = useStoreState((s) => s);

  const openHelpModal = () => setHelpModal(true);
  const closeHelpModal = () => setHelpModal(false);

  // constants
  const snapPoints = useMemo(() => ["50%"], []);

  const helpImages = [
    require("@assets/volunteerPage1.jpeg"),
    require("@assets/volunteerPage2.jpeg"),
    require("@assets/volunteerPage3.jpeg"),
  ];

  // funcs
  const getVictimData = async () => {
    if (!isEmpty(victimData)) {
      if (sampleVictim) {
        setVictim({
          profilePicture: require("@assets/lego.png"),
          name: victimData.title,
          phone: victimData.phone,
          lastSeen: victimData.lastSeen,
          bpm: victimData.bpm,
          location: {
            latitude: victimData.latlng.latitude,
            longitude: victimData.latlng.longitude,
          },
          locationName: await getLocationName(victimData.latlng),
        });
      } else {
        setLoading(true);
        const userDoc = doc(db, "users", victimData.id);
        const userInfo = (await getDoc(userDoc)).data();

        const lastSeen = DateTime.fromMillis(victimData.lastSeen);
        setVictim({
          profilePicture: require("@assets/lego.png"),
          name: victimData.title,
          phone: userInfo.phoneNum,
          lastSeen: lastSeen.toRelative(),
          bpm: `${randNumber({ min: 80, max: 150 })} bpm`,
          location: {
            latitude: victimData.latlng.latitude,
            longitude: victimData.latlng.longitude,
          },
          locationName: await getLocationName(victimData.latlng),
        });
        setLoading(false);
      }
    }
  };

  async function getLocationName(latlng) {
    setLoading(true);
    try {
      let locationFunction = httpsCallable(funcs, "getLocationName");
      let name = await locationFunction({
        latlng: [latlng.latitude, latlng.longitude].join(","),
      });

      name = await name.data;
      if (name.status !== "OK") {
        return "Error fetching location Name !";
      }
      return name.results[0].formatted_address;
    } catch (e) {
      console.warn(e);
      return "Error fetching location Name !";
    } finally {
      setLoading(false);
    }
  }

  const renderCarouselImage = (value) => {
    return (
      <View
        style={{
          shadowColor: "black",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          paddingTop: 10,
          elevation: 5,
          marginBottom: 12,
          borderRadius: 50,
        }}
      >
        <Image
          source={value.item}
          style={{
            borderRadius: 50,
            borderWidth: 5,
            backgroundColor: "white",
            resizeMode: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    );
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      changeBottomSheetActive(false);
    }
  }, []);

  // UI
  useEffect(() => {
    getVictimData();
  }, [victimData]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={backDrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        {victim ? (
          <>
            <View style={styles.sectionCard}>
              <View style={styles.victimPic}>
                <Avatar.Image size={75} source={victim.profilePicture} />
              </View>
              <View style={styles.victimInfo}>
                <View style={styles.victimInfoItem}>
                  <AntDesign name="user" size={20} />
                  <Text>{victim.name}</Text>
                </View>
                <View style={styles.victimInfoItem}>
                  <AntDesign name="clockcircleo" size={24} color="black" />
                  <Text>{victim.lastSeen}</Text>
                </View>
              </View>
              <View>
                <IconButton
                  icon="phone"
                  mode="contained"
                  style={{
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    Linking.openURL(`tel:${victim.phone}`);
                  }}
                />
                {user.isNgo && (
                  <IconButton
                    icon={"directions"}
                    mode="contained"
                    style={{
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      Linking.openURL(
                        `geo:0,0?q=${victim.location.latitude},${victim.location.longitude}`
                      );
                    }}
                  />
                )}
              </View>
            </View>
            {user.isNgo ? (
              <>
                <View style={[styles.sectionCard, styles.ngoInfoCard]}>
                  <View style={styles.victimInfoItem}>
                    <AntDesign name="pushpino" size={20} />
                    <Text numberOfLines={1}>
                      {loading ? "Fetching Location Name" : victim.locationName}
                    </Text>
                  </View>
                  <View style={styles.victimInfoItem}>
                    <AntDesign name="find" size={20} />
                    <Text>{`${victim?.location.latitude}, ${victim?.location.longitude}`}</Text>
                  </View>
                  <View style={styles.victimInfoItem}>
                    <Ionicons name="pulse" size={24} color="black" />
                    <Text>{victim.bpm}</Text>
                  </View>
                </View>

                <Button
                  icon="bell-alert"
                  mode="contained"
                  style={{
                    marginTop: 10,
                    height: "15%",
                    justifyContent: "center",
                  }}
                >
                  Press Here to make the victims phone ring !
                </Button>
              </>
            ) : (
              <>
                <View style={[styles.sectionCard, styles.actionButton]}>
                  <View>
                    <IconButton
                      icon="information"
                      mode="contained"
                      size={50}
                      onPress={openHelpModal}
                    />
                    <Text> How to help ?</Text>
                  </View>

                  <View>
                    <IconButton
                      icon="directions"
                      size={50}
                      mode="contained"
                      onPress={() => {
                        Linking.openURL(
                          `geo:0,0?q=${victim.location.latitude},${victim.location.longitude}`
                        );
                      }}
                    />
                    <Text> Directions</Text>
                  </View>
                </View>
                <View style={[styles.sectionCard, styles.infoCard]}>
                  <IconButton icon="information" size={15} mode="outlined" />
                  <Text
                    variant="bodySmall"
                    style={{
                      flexShrink: 1,
                    }}
                  >
                    Use the information button to learn how to assist the victim
                    & wait for the authorites arrive!
                  </Text>
                </View>
              </>
            )}
          </>
        ) : (
          <Text>Please select a victim from the map !</Text>
        )}
        <Portal>
          <Modal
            visible={helpModal}
            onDismiss={closeHelpModal}
            contentContainerStyle={styles.modal}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 10,
              }}
            >
              <Carousel
                contentContainerStyle
                data={helpImages}
                renderItem={renderCarouselImage}
                sliderWidth={370}
                itemWidth={350}
                loop
              />
            </View>
          </Modal>
        </Portal>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
  },
  sectionCard: {
    margin: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 7,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    borderRadius: 10,
  },
  victimPic: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 2,
    borderColor: "#a81c06",
    alignSelf: "center",
  },
  victimInfo: {
    gap: 10,
    justifyContent: "center",
  },
  victimInfoItem: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  infoCard: {
    alignItems: "center",
    backgroundColor: "#E8DEF8",
  },
  modal: {
    height: "60%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ngoInfoCard: {
    flexDirection: "column",
    gap: 10,
  },
});

export default VictimDetail;
