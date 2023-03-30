import { createStore } from "easy-peasy";
import locationStore from "./location";
import authStore from "./auth";

export default store = createStore({
  ...authStore,
  ...locationStore,
});
