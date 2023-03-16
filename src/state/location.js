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
    return `Longitude: ${state.location?.longitude} \nLatitude: ${state.location?.latitude} `;
  }),
};
