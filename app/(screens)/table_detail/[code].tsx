import { ChartDetailHeader } from "@/components/pages/chart_detail";
import { GrwothReferenceTable, PatientMeasurementPanel } from "@/components/pages/table_detail";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import {
  GetGrowthReferenceTableRequest,
  GetIndicatorRequest,
} from "@/core/diagnostics";
import { TABLE_UI_DATA } from "@/src/constants/ui";
import { useToast } from "@/src/context";
import { useGrowthIndicators, useGrowthTables } from "@/src/hooks";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
import colors from "tailwindcss/colors";

export default function TableDetailScreen() {
  const params = useLocalSearchParams<{
    code: string;
    indicatorCode: string;
  }>();
  const growthTableRequest = useMemo<GetGrowthReferenceTableRequest>(
    () => ({ code: params.code }),
    [params.code]
  );
  const indicatorRequest = useMemo<GetIndicatorRequest>(
    () => ({
      code: params.indicatorCode,
    }),
    [params.indicatorCode]
  );
  const {
    data: growthTables,
    error,
    onLoading,
  } = useGrowthTables(growthTableRequest);
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
        "Erreur lors du chargement des table de croissance. Veillez reessayer!"
      );
    }
  }, [error, indicatorError]);

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
      <ChartDetailHeader
        name={
          TABLE_UI_DATA[growthTables[0]?.code as keyof typeof TABLE_UI_DATA]
            ?.indicator?.label || ""
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-background-primary"
      >
        <PatientMeasurementPanel
          indicatorDto={indicators[0]}
       
        />
      </ScrollView>
      <GrwothReferenceTable growthTableData={growthTables[0]} />
    </React.Fragment>
  );
}
