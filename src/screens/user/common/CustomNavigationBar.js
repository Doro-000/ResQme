import React from "react";

import { Appbar } from "react-native-paper";

const { Header, Content, Action } = Appbar;

export default function CustomNavigationBar() {
  return (
    <Header elevated>
      <Action icon="menu" onPress={() => {}} />
      <Content title="Custom NavBar" />
      <Action icon="account" onPress={() => {}} />
    </Header>
  );
}
