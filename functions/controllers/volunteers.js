const { volunteerFilterSchema } = require("../validations");
const { haversineDistance, isInPolygon } = require("../utils");
const { rdb } = require("../firebaseConfig");

const getvolunteers = async (req, res) => {
  const filter = JSON.parse(req.query.filter ?? "{}");
  const { error } = volunteerFilterSchema.validate(filter);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const locations = rdb.ref("volunteers");
  const { time, radius, polygon, type } = filter;

  const { from, to } = time;
  let volunteers = locations.orderByChild("lastSeen");

  if (from && to) {
    volunteers.startAt(from).endAt(to);
  } else if (from) {
    volunteers.startAt(from);
  }

  if (type) {
    volunteers.orderByChild("type").equalTo(type);
  }

  volunteers = (await volunteers.get()).toJSON() ?? [];

  if (radius || polygon) {
    if (radius) {
      const { latitude, longitude, distance, unit } = radius;

      const isMiles = unit == "MI" ? true : false;

      volunteers = volunteers.filter((volunteer) => {
        const calculatedDistance = haversineDistance(
          volunteer.latng,
          { latitude, longitude },
          isMiles
        );

        return calculatedDistance <= distance;
      });
    } else {
      const { vertices } = polygon;

      volunteers = volunteers.filter((volunteer) => {
        return (calculatedDistance = isInPolygon(
          [volunteer.latlng.latitude, volunteer.latlng.longitude],
          vertices
        ));
      });
    }
  }

  res.status(200).json(volunteers);
};

module.exports = {
  getvolunteers,
};
