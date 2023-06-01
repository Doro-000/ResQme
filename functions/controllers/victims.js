const { victimsFilterSchema } = require("../validations");
const { haversineDistance, isInPolygon } = require("../utils");
const { rdb } = require("../firebaseConfig");

const getVictims = async (req, res) => {
  const filter = JSON.parse(req.query.filter ?? "{}");
  const { error } = victimsFilterSchema.validate(filter);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const locations = rdb.ref("locations");
  const { time, radius, polygon } = filter;

  const { from, to } = time;
  let victims = locations.orderByChild("lastSeen");

  if (from && to) {
    victims.startAt(from).endAt(to);
  } else if (from) {
    victims.startAt(from);
  }

  victims = (await victims.get()).toJSON() ?? [];

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
