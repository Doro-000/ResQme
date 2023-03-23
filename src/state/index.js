import { createStore } from "easy-peasy";

import locationStore from "./location";
import authStore from "./auth";
import uiStore from "./ui";

export default store = createStore({
  ...authStore,
  ...locationStore,
  ...uiStore,
});
