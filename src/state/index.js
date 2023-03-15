import { createStore } from "easy-peasy";

import location from "./location";
import authStore from "./auth";

export default store = createStore({
  ...authStore,
  ...location,
});
