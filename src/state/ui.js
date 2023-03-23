import { action } from "easy-peasy";

export default uiStore = {
  bottomSheetActive: false,
  selectedVictim: null,

  toggleBottomSheet: action((state, _) => {
    state.bottomSheetActive ^= true;
  }),

  setSelectedVictim: action((state, payload) => {
    state.selectedVictim = payload;
  }),
};
