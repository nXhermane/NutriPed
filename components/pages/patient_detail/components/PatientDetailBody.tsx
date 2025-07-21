import React from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { PatientDetailOverviews } from "./PatientDetailOverviews";
import { PatientDetailMedicalRecord } from "./PatientDetailMedialRecord";
import { PatientDetailDiagnostic } from "./PatientDetailDiagnostic";
import { PatientDetailTreatment } from "./PatientDetailTreatment";
import { Dimensions, useWindowDimensions } from "react-native";
import { TabBarItem } from "../../shared";

const renderScene = SceneMap({
  overviews: PatientDetailOverviews,
  medical_record: PatientDetailMedicalRecord,
  diagnostic: PatientDetailDiagnostic,
  treatment: PatientDetailTreatment,
});
const routes = [
  { key: "overviews", title: "Vue d'ensemble" },
  { key: "medical_record", title: "Dossier Medical" },
  { key: "diagnostic", title: "Diagnostic" },
  { key: "treatment", title: "Traitement" },
];
export function PatientDetailBody() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      lazy={true}
      lazyPreloadDistance={2}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={tabBarProps => (
        <TabBar
          {...tabBarProps}
          renderTabBarItem={({ key, ...otherProps }) => (
            <TabBarItem {...otherProps} key={key} />
          )}
          scrollEnabled
        />
      )}
    />
  );
}
