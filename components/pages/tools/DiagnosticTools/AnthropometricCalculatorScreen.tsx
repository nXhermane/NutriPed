import * as React from "react";
import { useWindowDimensions } from "react-native";
import {
  TabView,
  SceneMap,
  TabBar,
} from "react-native-tab-view";
import { AnthropometricCalculatorPanel } from "./AnthropometricCalculatorPanel";
import { AnthropometricCalculatorHistory } from "./AnthropometricCalculatorHistory";
import { TabBarItem } from "../../shared";

const renderScene = SceneMap({
  first: AnthropometricCalculatorPanel,
  second: AnthropometricCalculatorHistory,
});

const routes = [
  { key: "first", title: "Calcul" },
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
      renderTabBar={tabBarProps => (
        <TabBar
          {...tabBarProps}
          renderTabBarItem={({ key, ...otherProps }) => (
            <TabBarItem {...otherProps} key={key} />
          )}
        />
      )}
    />
  );
};
