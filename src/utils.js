import { set, update, remove } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@firebaseConfig";
import * as Location from "expo-location";

import { pick } from "lodash";
import { DateTime } from "luxon";

async function sendLocation(rdbRef, time, locationUpdate, user, location) {
  // set initial location
  await set(rdbRef, {
    ...pick(user, ["id", "name", "phoneNum"]),
    latlng: { latitude: location.latitude, longitude: location.longitude },
    lastSeen: DateTime.now().toISO(),
  });

  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced, // foreground location update
      timeInterval: time,
    },
    async (location) => {
      locationUpdate(location.coords);

      // update every 3 minutes
      await update(rdbRef, {
        latlng: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    }
  );
}

async function exitLocationShare(rdbRef, mode, user) {
  await remove(rdbRef); // stop tracking

  const userDoc = doc(db, "users", user.id);
  await updateDoc(userDoc, { mode }); // turn location share
}

export { sendLocation, exitLocationShare };
