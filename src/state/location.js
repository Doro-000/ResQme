import { action, computed } from "easy-peasy";
import { isEmpty } from "lodash";

export default locationStore = {
  location: {},
  setLocation: action((state, payload) => {
    state.location = payload;
  }),
  getLocationText: computed((state) => {
    if (isEmpty(state.location)) {
      return "";
    }
    return `Longitude: ${state.location?.coords.longitude} \nLatitude: ${state.location?.coords.latitude} `;
  }),
};
