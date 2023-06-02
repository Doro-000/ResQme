const { victimsFilterSchema } = require("../validations");
const { haversineDistance, isInPolygon } = require("../utils");
const { rdb } = require("../firebaseConfig");

const getVictims = async (req, res) => {
  let filter = {};
  try {
    filter = JSON.parse(req.query.filter ?? "{}");
    const { error } = victimsFilterSchema.validate(filter);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const locations = rdb.ref("victims");
  const { time, radius, polygon } = filter;

  let victims = locations.orderByChild("lastSeen");

  if (time) {
    const { from, to } = time;
    if (from && to) {
      victims.startAt(from).endAt(to);
    } else if (from) {
      victims.startAt(from);
    }
  }

  const result = (await victims.get()) ?? [];
  victims = [];

  result.forEach((snapshot) => {
    victims.push(snapshot.val());
  });

  if (radius || polygon) {
    if (radius) {
      const { latitude, longitude, distance, unit } = radius;

      const isMiles = unit == "MI" ? true : false;

      victims = victims.filter((victim) => {
        const calculatedDistance = haversineDistance(
          victim.latlng,
          { latitude, longitude },
          isMiles
        );

        return calculatedDistance <= distance;
      });
    } else {
      const { vertices } = polygon;

      victims = victims.filter((victim) => {
        return (calculatedDistance = isInPolygon(
          [victim.latlng.latitude, victim.latlng.longitude],
          vertices
        ));
      });
    }
  }

  res.status(200).json(victims);
};

module.exports = {
  getVictims,
};
