import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { AnthropometricCalculatorPanel } from "./AnthropometricCalculatorPanel";
import { AnthropometricCalculatorHistory } from "./AnthropometricCalculatorHistory";

const renderScene = SceneMap({
  first: AnthropometricCalculatorPanel,
  second: AnthropometricCalculatorHistory,
});

const routes = [
  { key: "first", title: "Calculator" },
  { key: "second", title: "Historique" },
];

export const AnthropometricCalculatorScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
