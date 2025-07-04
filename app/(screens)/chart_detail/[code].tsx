import { Center } from "@/components/ui/center";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useGrowthCharts, useGrowthIndicators } from "@/src/hooks";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { useToast } from "@/src/context";
import { VStack } from "@/components/ui/vstack";
import {
  ChartDetailHeader,
  GrowthReferenceChart,
  PatientMeasurementPanel,
} from "@/components/pages/chart_detail";
import { GROWTH_INDICATORS, IndicatorUIType } from "@/src/constants/ui";
import {
  GetGrowthReferenceChartRequest,
  GetIndicatorRequest,
  GrowthRefChartAndTableCodes,
} from "@/core/diagnostics";
import { ScrollView } from "react-native";

const ChartDetail = () => {
  const params = useLocalSearchParams<{
    code: string;
    indicatorCode: string;
  }>();
  const growthChartRequest = useMemo<GetGrowthReferenceChartRequest>(
    () => ({ code: params.code }),
    [params.code]
  );
  const indicatorRequest = useMemo<GetIndicatorRequest>(
    () => ({
      code: params.indicatorCode,
    }),
    [params.indicatorCode]
  );
  const [indicatorUiData, setIndicatorUiData] = useState<IndicatorUIType>();
  const {
    data: growthCharts,
    error,
    onLoading,
  } = useGrowthCharts(growthChartRequest);
  const {
    data: indicators,
    error: indicatorError,
    onLoading: indicatorLoading,
  } = useGrowthIndicators(indicatorRequest);
  const toast = useToast();
  useEffect(() => {
    if (error || indicatorError) {
      toast.show(
        "Error",
        "Erreur de chargement",
        "Erreur lors du chargement de la courbe de croissance. Veillez reessayer!"
      );
    }
  }, [error, indicatorError]);
  useEffect(() => {
    if (params.indicatorCode) {
      const indicatorData =
        GROWTH_INDICATORS[
          params.indicatorCode as keyof typeof GROWTH_INDICATORS
        ];
      setIndicatorUiData(indicatorData);
    }
  }, [params.indicatorCode]);

  if (onLoading || indicatorLoading)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
      </Center>
    );

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          animationDuration: 100,
          presentation: "modal",
        }}
      />
      <ChartDetailHeader name={indicatorUiData?.label || ""} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-background-primary"
      >
        <VStack className="flex-1 bg-background-primary pb-20">
          <PatientMeasurementPanel
            growthChartDto={growthCharts[0]}
            indicatorDto={indicators[0]}
          />
        </VStack>
      </ScrollView>
      <GrowthReferenceChart
        chartData={growthCharts[0]?.data || []}
        code={growthCharts[0]?.code as GrowthRefChartAndTableCodes}
        chartName={growthCharts[0]?.name || ""}
      />
    </React.Fragment>
  );
};

export default ChartDetail;
