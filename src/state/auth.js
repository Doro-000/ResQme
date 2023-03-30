import { action, computed } from "easy-peasy";
import { isEmpty } from "lodash";

export default authStore = {
  user: {},
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  logout: action((state, _) => {
    state.user = {};
  }),
};
