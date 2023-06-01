const pointInPolygon = require("robust-point-in-polygon");

// credit to: https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  var lon1 = coords1.longitude;
  var lat1 = coords1.latitude;

  var lon2 = coords2.longitude;
  var lat2 = coords2.latitude;

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if (isMiles) d /= 1.60934;

  return d;
}

function isInPolygon(point, polygon) {
  const res = pointInPolygon(polygon, point);

  if (res === -1 || res === 0) {
    return true;
  }
  return false;
}

module.exports = {
  haversineDistance,
  isInPolygon,
};
