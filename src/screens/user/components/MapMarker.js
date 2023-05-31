import React from "react";

import { Marker } from "react-native-maps";

export default function MapMarker({
  marker,
  index,
  onPress,
  onCalloutPress,
  coordinate,
  cluster,
}) {
  return (
    <Marker
      key={index}
      coordinate={marker.latlng}
      title={marker.title}
      description={"Click to see more details !"}
      identifier={marker.id}
      onPress={onPress}
      onCalloutPress={onCalloutPress}
    />
  );
}
