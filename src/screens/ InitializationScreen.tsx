import { useInitialization } from "@context";
import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const InitializationScreen = () => {
  const { isLoading, error, initializeApp } = useInitialization();

  return <View></View>;
};
const styles = StyleSheet.create({
  // Styles à définir
});
export default InitializationScreen;
