// REACT
import * as React from "react";

// PAPER
import { Provider as PaperProvider } from "react-native-paper";

// STATE PROVIDER (easy-peasy)
import { StoreProvider } from "easy-peasy";
import store from "./state";

// ROOT NAVIGATION
import RootNavigator from "./screens";

function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </StoreProvider>
  );
}

export default App;
