import { action } from "easy-peasy";

export default authStore = {
  user: {},
  medicalInfo: {},
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setMedicalInfo: action((state, payload) => {
    state.medicalInfo = payload;
  }),
  logout: action((state, _) => {
    state.user = {};
    state.medicalInfo = {};
  }),
};
