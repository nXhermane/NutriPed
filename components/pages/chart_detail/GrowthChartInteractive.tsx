import { VStack } from "@/components/ui/vstack";
import { ChartDataDto } from "@/core/diagnostics";
import {
  AxisLabel,
  ChartUiDataType,
  DisplayMode,
  LengthHeightMode,
} from "@/src/constants/ui";
import { useUI } from "@/src/context";
import { ChartDataPoint, ChartDataXAxisProps } from "@/src/hooks";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { useFont } from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useState } from "react";
import colors from "tailwindcss/colors";
import { CartesianChart, Line } from "victory-native";

export interface GrowthInteractiveChartProps {
  data: ChartDataPoint[];
  displayMode: DisplayMode;
  chartUiData: ChartUiDataType;
}
export const GrowthInteractiveChart: React.FC<GrowthInteractiveChartProps> = ({
  data,
  displayMode,
  chartUiData,
}) => {
  const font = useFont(Poppins_500Medium, 8);
  const { colorMode } = useUI();
  const xKey = useMemo(() => {
    if (
      LengthHeightMode.includes(
        displayMode as (typeof LengthHeightMode)[number]
      )
    ) {
      return "lenhei";
    } else {
      return displayMode === "months" ? "ageInMonth" : "ageInYear";
    }
  }, [displayMode]);
  const yKeys = useMemo(
    () => [
      "SD4neg",
      "SD3neg",
      "SD2neg",
      "SD1neg",
      "SD0",
      "SD1",
      "SD2",
      "SD3",
      "SD4",
    ],
    []
  );
  const xAxisConfig = useMemo(
    () => ({
      font,
      lineColor:
        colorMode === "light"
          ? `${colors.gray["300"]}BF`
          : `${colors.gray["700"]}99`,
      labelColor:
        colorMode === "light"
          ? `${colors.gray["600"]}`
          : `${colors.gray["300"]}`,
      enableRescaling: true,
      formatXLabel(label: number) {
        return (
          label.toString() +
          (xKey === "lenhei"
            ? AxisLabel["height"]
            : xKey === "ageInMonth"
              ? AxisLabel["age_month"]
              : xKey === "ageInYear"
                ? AxisLabel["age_years"]
                : "")
        );
      },
    }),
    [colorMode, font, xKey]
  );
  const yAxisConfig = useMemo(
    () => ({
      font,
      lineColor:
        colorMode === "light"
          ? `${colors.gray["300"]}BF`
          : `${colors.gray["700"]}99`,
      labelColor:
        colorMode === "light"
          ? `${colors.gray["600"]}`
          : `${colors.gray["300"]}`,
      enableRescaling: true,
      labelRotate: 45,
      formatYLabel: (label: number) =>
        label.toString() + chartUiData.yAxisLabel,
      
    }),
    [colorMode, font, chartUiData]
  );
  return (
    <VStack className=" h-v-96 rounded-xl bg-background-primary">
      <CartesianChart
        data={data as any[]}
        xKey={xKey}
        yKeys={yKeys}
        xAxis={xAxisConfig}
        yAxis={[yAxisConfig]}
        domainPadding={{right: 10}}
         padding={{
          left: 10,
          right:10,
          bottom: 20
         }}
      >
        {({ canvasSize, chartBounds, points }) => {
          return (
            <React.Fragment>
              <Line
                points={points.SD4neg}
                color={colors.red["700"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD3neg}
                color={colors.red["500"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD2neg}
                color={colors.orange["400"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD1neg}
                color={colors.yellow["300"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD0}
                color={colors.green["500"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD1}
                color={colors.sky["400"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD2}
                color={colors.indigo["500"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD3}
                color={colors.purple["500"]}
                strokeWidth={1}
              />
              <Line
                points={points.SD4}
                color={colors.rose["600"]}
                strokeWidth={1}
              />
            </React.Fragment>
          );
        }}
      </CartesianChart>
    </VStack>
  );
};
