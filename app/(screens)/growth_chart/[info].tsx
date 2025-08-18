import { FakeBlur, Loading } from "@/components/custom";
import { GrowthReferenceChart } from "@/components/pages/chart_detail";
import { GrowthChartScreenHeader } from "@/components/pages/growth_chart";
import {
  GetGrowthReferenceChartRequest,
  GrowthIndicatorValueDto,
} from "@/core/evaluation";
import { useUI } from "@/src/context";
import { useGrowthCharts } from "@/src/hooks";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";

const GrowthChart = () => {
  const { info } = useLocalSearchParams();
  const { colorMode } = useUI();
  const growthIndicatorValue = useMemo<GrowthIndicatorValueDto>(
    () => JSON.parse(info as string),
    [info]
  );

  const growthChartRequest = useMemo<GetGrowthReferenceChartRequest>(
    () => ({ code: growthIndicatorValue.reference.source }),
    [growthIndicatorValue.reference.source]
  );
  const {
    data: growthCharts,
    error,
    onLoading,
  } = useGrowthCharts(growthChartRequest);

  if (onLoading) return <Loading />;

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "transparentModal",
        }}
      />
      <FakeBlur
        className="flex-1"
        // experimentalBlurMethod="dimezisBlurView"
        // tint={colorMode}
        // intensity={colorMode === "light" ? 50 : 90}
      >
        <GrowthChartScreenHeader name={growthCharts[0]?.name || ""} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-8"
        >
          <GrowthReferenceChart
            chartData={growthCharts[0]?.data || []}
            chartName={""}
            code={growthIndicatorValue.reference.source}
            singlePlotteData={{
              xAxis: growthIndicatorValue.computedValue[0],
              yAxis: growthIndicatorValue.computedValue[1],
              zScore: growthIndicatorValue.value,
              zScoreRange: growthIndicatorValue.valueRange,
            }}
          />
        </ScrollView>
      </FakeBlur>
    </React.Fragment>
  );
};

export default GrowthChart;
