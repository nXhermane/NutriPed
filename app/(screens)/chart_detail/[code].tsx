import { Center } from "@/components/ui/center";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  IndicatorUIType,
  useGrowthCharts,
  useGrowthIndicators,
} from "@/src/hooks";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { useToast } from "@/src/context";
import { VStack } from "@/components/ui/vstack";
import {
  ChartDetailHeader,
  InteractiveChartSession,
  PatientDataSession,
} from "@/components/pages/chart_detail";
import { GROWTH_INDICATORS } from "@/src/constants/ui";
import {
  GetGrowthReferenceChartRequest,
  GetIndicatorRequest,
} from "@/core/diagnostics";

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
      <VStack className="flex-1 bg-background-primary">
        <ChartDetailHeader name={indicatorUiData?.label || ""} />
        <PatientDataSession
          growthChartDto={growthCharts[0]}
          indicatorDto={indicators[0]}
        />
        <InteractiveChartSession
          title="Courbe de croissance interactive"
          growthChartDto={growthCharts[0]}
        />
      </VStack>
    </React.Fragment>
  );
};

export default ChartDetail;
