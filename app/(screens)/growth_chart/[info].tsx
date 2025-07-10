import { GrowthReferenceChart } from "@/components/pages/chart_detail";
import { GrowthChartScreenHeader } from "@/components/pages/growth_chart";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import {
  GetGrowthReferenceChartRequest,
  GrowthIndicatorValue,
  GrowthIndicatorValueDto,
} from "@/core/diagnostics";
import { useUI } from "@/src/context";
import { useGrowthCharts } from "@/src/hooks";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import colors from "tailwindcss/colors";

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

  if (onLoading)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
      </Center>
    );

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "transparentModal",
        }}
      />
      <BlurView
        className="flex-1"
        experimentalBlurMethod="dimezisBlurView"
        tint={colorMode}
        intensity={colorMode === "light" ? 50 : 90}
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
      </BlurView>
    </React.Fragment>
  );
};

export default GrowthChart;
