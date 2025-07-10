import React from "react";
import { SuggestMilkPanel } from "./SuggestMilkPanel";
import { MedicineDosagePanel } from "./MedicineDosagePanel";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { TabBarItem } from "../../shared";

const renderScene = SceneMap({
  first: SuggestMilkPanel,
  second: MedicineDosagePanel,
});

const routes = [
  { key: "first", title: "Suggestion du lait" },
  { key: "second", title: "Dosage de médicament" },
];
export interface CalculToolsProps {}

export const CalculTools: React.FC<CalculToolsProps> = ({}) => {
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
