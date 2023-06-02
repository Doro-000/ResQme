const { medicalInfoSchema } = require("../validations");
const { db } = require("../firebaseConfig");
const firebase = require("firebase-admin");

const getMedicalInfo = async (req, res) => {
  let filter = {};
  try {
    filter = JSON.parse(req.query.filter ?? "{}");
    const { error } = medicalInfoSchema.validate(filter);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const { victimIds } = filter;
  const medicalInfoCollection = db.collection("userMedicalInfo");

  const snapshots = await medicalInfoCollection
    .where(firebase.firestore.FieldPath.documentId(), "in", victimIds)
    .get();

  const result = [];
  snapshots.forEach((snapshot) => {
    result.push(snapshot.data());
  });
  res.status(200).json(result);
};

module.exports = {
  getMedicalInfo,
};
