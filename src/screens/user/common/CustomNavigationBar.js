import React from "react";

import { Appbar } from "react-native-paper";
import { StackActions } from "@react-navigation/native";

const { Header, Content, Action } = Appbar;

export default function CustomNavigationBar({ navigation }) {
  return (
    <Header elevated mode="center-aligned">
      <Action icon="menu" onPress={() => {}} />
      <Content
        title="ResQme"
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.dispatch(StackActions.popToTop());
          }
        }}
      />
      <Action
        icon="account"
        onPress={() => navigation.navigate("Profile")}
        color=""
      />
    </Header>
  );
}
