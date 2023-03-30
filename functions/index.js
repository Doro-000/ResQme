const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.getLocationName = functions
  .runWith({ secrets: ["GOOGLE_MAP_KEY"] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    const { latlng } = data;
    const GOOGLE_mapKey = process.env.GOOGLE_MAP_KEY;
    const request_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${GOOGLE_mapKey}`;

    return await (await fetch(request_url)).json();
  });
