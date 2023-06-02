const functions = require("firebase-functions");
const fetch = require("node-fetch");

const express = require("express");
const cors = require("cors");

const { getVictims } = require("./controllers/victims.js");
const { getMedicalInfo } = require("./controllers/medicalInfo");
const { getvolunteers } = require("./controllers/volunteers");

const { rdb } = require("./firebaseConfig");

exports.getLocationName = functions
  .runWith({ secrets: ["GOOGLE_MAP_KEY"] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    const { latlng } = data;
    const GOOGLE_mapKey = process.env.GOOGLE_MAP_KEY;
    const request_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${GOOGLE_mapKey}`;

    return await (await fetch(request_url)).json();
  });

exports.ringVictimPhone = functions.https.onCall(async (data, context) => {
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     "failed-precondition",
  //     "The function must be called while authenticated."
  //   );
  // }

  functions.logger.info(data);
  const { victimId } = data;
  const pings = rdb.ref(`pings/${victimId}`);

  const snapshot = await pings.once("value");
  const value = snapshot.val();
  if (value) {
    const timestamp = new Date(value.timestamp);
    const timeDiff = Math.floor(new Date().getTime() - timestamp.getTime());
    const secondsDiff = Math.floor(timeDiff / 1000);

    if (secondsDiff > 10) {
      await pings.set({ timestamp: new Date().toISOString() });
    }
  } else {
    await pings.set({ timestamp: new Date().toISOString() });
  }
});

const app = express();
app.use(cors());

app.get("/api/getVictims", getVictims);
app.get("/api/getMedicalInfo", getMedicalInfo);
app.get("/api/getVolunteers", getvolunteers);

exports.api = functions.https.onRequest(app);
