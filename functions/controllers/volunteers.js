const { volunteerFilterSchema } = require("../validations");
const { haversineDistance, isInPolygon } = require("../utils");
const { rdb } = require("../firebaseConfig");

const getvolunteers = async (req, res) => {
  let filter = {};
  try {
    filter = JSON.parse(req.query.filter ?? "{}");
    const { error } = volunteerFilterSchema.validate(filter);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const locations = rdb.ref("volunteers");
  const { time, radius, polygon, type } = filter;

  let volunteers = locations.orderByChild("lastSeen");

  if (time) {
    const { from, to } = time;
    if (from && to) {
      volunteers.startAt(from).endAt(to);
    } else if (from) {
      volunteers.startAt(from);
    }
  }

  const result = (await volunteers.get()) ?? [];
  volunteers = [];

  result.forEach((snapshot) => {
    data = snapshot.val();
    if (type) {
      if (data.mode === type) {
        volunteers.push(data);
      }
    } else {
      volunteers.push(data);
    }
  });

  if (radius || polygon) {
    if (radius) {
      const { latitude, longitude, distance, unit } = radius;

      const isMiles = unit == "MI" ? true : false;

      volunteers = volunteers.filter((volunteer) => {
        const calculatedDistance = haversineDistance(
          volunteer.latlng,
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
