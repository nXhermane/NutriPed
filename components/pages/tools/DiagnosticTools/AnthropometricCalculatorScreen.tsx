import * as React from "react";
import { useWindowDimensions, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { AnthropometricCalculatorPanel } from "./AnthropometricCalculatorPanel";
import { AnthropometricCalculatorHistory } from "./AnthropometricCalculatorHistory";
import { TabBarItem } from "../../shared";
import { router } from "expo-router";

const renderScene = SceneMap({
  first: AnthropometricCalculatorPanel,
  second: AnthropometricCalculatorHistory,
});

const routes = [
  { key: "first", title: "Calcul" },
  { key: "second", title: "Historique" },
];

function AnthropometricCalculatorScreenComponent() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation();

  React.useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        router.back();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
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
}

export const AnthropometricCalculatorScreen = React.memo(
  AnthropometricCalculatorScreenComponent
);
