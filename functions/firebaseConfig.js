const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
  }),
  databaseURL:
    "https://resqme-4365d-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.firestore();
const rdb = admin.database();

module.exports = {
  db,
  rdb,
  admin,
};
