// REACT
import * as React from "react";

// PAPER
import { Provider as PaperProvider } from "react-native-paper";

// STATE PROVIDER (easy-peasy)
import { StoreProvider } from "easy-peasy";
import store from "./state";

// ROOT NAVIGATION
import RootNavigator from "./screens";

import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
  return (
    <StoreProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <RootNavigator />
        </PaperProvider>
      </GestureHandlerRootView>
    </StoreProvider>
  );
}

export default App;
