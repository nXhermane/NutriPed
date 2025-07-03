import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { DAY_IN_YEARS } from "@/core/diagnostics";
import {
  AxisLabel,
  CHART_LEGEND,
  ChartUiDataType,
  DisplayMode,
  LengthHeightMode,
} from "@/src/constants/ui";
import { useUI } from "@/src/context";
import { ChartDataPoint, PlottedSerieData } from "@/src/hooks";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { Circle, useFont } from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import colors from "tailwindcss/colors";
import {
  CartesianActionsHandle,
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { InfoIcon } from "lucide-react-native";

export interface GrowthInteractiveChartProps {
  data: ChartDataPoint[];
  displayMode: DisplayMode;
  chartUiData: ChartUiDataType;
  chartName: string;
  zoomActivate: boolean;
  plottedSeriesData: PlottedSerieData[];
}
export const GrowthInteractiveChart: React.FC<GrowthInteractiveChartProps> = ({
  data,
  displayMode,
  chartUiData,
  chartName,
  zoomActivate,
  plottedSeriesData,
}) => {
  const font = useFont(Poppins_500Medium, 8);
  const [pointIsPlottedOnChart, setPointIsPLottedOnChart] =
    useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(false);
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
        if (label === undefined) {
          console.log("label undefined");
          return "";
        }
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
  const transformState = useChartTransformState({
    scaleX: 1,
    scaleY: 1.0,
  });
  const { state, isActive } = useChartPressState({
    x: 0,
    y: {
      SD4neg: 1,
      SD3neg: 1,
      SD2neg: 1,
      SD1neg: 1,
      SD0: 1,
      SD1: 1,
      SD2: 1,
      SD3: 1,
      SD4: 1,
    },
  });
  const actionsRef = useRef<CartesianActionsHandle<typeof state>>(null);
  const tapGesture = Gesture.Tap().onStart(e => {
    state.isActive.value = true;
    actionsRef.current?.handleTouch(state, e.x, e.y);
  });
  const composed = Gesture.Race(tapGesture);

  useEffect(() => {
    setPointIsPLottedOnChart(plottedSeriesData.length != 0);
  }, [plottedSeriesData]);
  return (
    <React.Fragment>
      <Box className="m-1 mb-3">
        <Heading className="text-center font-h4 text-base font-medium">
          {chartName}
        </Heading>
      </Box>
      <VStack className="m-1 h-v-96 rounded-xl bg-background-primary">
        <CartesianChart
          data={data as any[]}
          xKey={xKey}
          yKeys={yKeys}
          xAxis={xAxisConfig}
          yAxis={[yAxisConfig]}
          domainPadding={{ right: 10 }}
          padding={{
            left: 10,
            right: 10,
            bottom: 20,
          }}
          actionsRef={actionsRef as any}
          customGestures={composed}
          transformState={zoomActivate ? transformState.state : undefined}
          chartPressState={state as any}
          chartPressConfig={{
            pan: {
              activateAfterLongPress: 0,
              activeOffsetX: 0,
              activeOffsetY: 0,
              failOffsetX: 0,
              failOffsetY: 0,
            },
          }}
        >
          {({ canvasSize, chartBounds, points, xScale, yScale }) => {
            return (
              <React.Fragment>
                <MemoLine
                  points={points.SD4neg}
                  color={colors.red["700"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD3neg}
                  color={colors.red["500"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD2neg}
                  color={colors.orange["400"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD1neg}
                  color={colors.yellow["300"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD0}
                  color={colors.green["500"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD1}
                  color={colors.sky["400"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD2}
                  color={colors.indigo["500"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD3}
                  color={colors.purple["500"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <MemoLine
                  points={points.SD4}
                  color={colors.rose["600"]}
                  strokeWidth={1}
                  animate={{ type: "timing", duration: 300 }}
                  opacity={pointIsPlottedOnChart ? 0.5 : 1}
                />
                <PlottedSeriesDataRenderComponent
                  data={plottedSeriesData}
                  xKey={xKey}
                  xScale={xScale}
                  yScale={yScale}
                />
                {isActive && (
                  <React.Fragment>
                    <React.Fragment>
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD4neg.position}
                        color={colors.red["700"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD3neg.position}
                        color={colors.red["500"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD2neg.position}
                        color={colors.orange["400"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD1neg.position}
                        color={colors.yellow["300"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD0.position}
                        color={colors.green["500"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD1.position}
                        color={colors.sky["400"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD2.position}
                        color={colors.indigo["500"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD3.position}
                        color={colors.purple["500"]}
                      />
                      <ToolTip
                        x={state.x.position}
                        y={state.y.SD4.position}
                        color={colors.rose["600"]}
                      />
                    </React.Fragment>
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          }}
        </CartesianChart>
      </VStack>
      <Pressable
        className="rounded-full bg-primary-c_light w-5 h-5 items-center justify-center mt-2 ml-1 "
        onPress={() => setShowLegend(prev => !prev)}
      >
        <Icon as={InfoIcon} className="h-3 w-3 text-typography-primary" />
      </Pressable>
      {showLegend && (
        <HStack className="flex-wrap justify-center gap-2">
          {[
            ...CHART_LEGEND,
            ...plottedSeriesData.map(({ label, ui: { lineColor } }) => ({
              label: label,
              color: lineColor,
            })),
          ].map(({ color, label }) => (
            <LegendItem key={label} color={color} label={label} />
          ))}
        </HStack>
      )}
    </React.Fragment>
  );
};

export function ToolTip({
  x,
  y,
  color,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  color: string;
}) {
  return <Circle cx={x} cy={y} r={4} color={color} />;
}

const MemoLine = React.memo(Line);
const MemoScatter = React.memo(Scatter);
export interface PlottedSeriesDataRenderComponentProps {
  data: PlottedSerieData[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  xKey: "lenhei" | "ageInMonth" | "ageInYear";
}
export const PlottedSeriesDataRenderComponent: React.FC<PlottedSeriesDataRenderComponentProps> =
  React.memo(({ data, xKey, xScale, yScale }) => {
    return (
      <React.Fragment>
        {data.map(({ data: serieData, ui: { lineColor }, id }) => {
          const plottedPoints = serieData.map(({ variables, yAxis }) => {
            const xValue = (
              xKey === "lenhei"
                ? variables["lenhei"]
                : xKey === "ageInMonth"
                  ? variables["age_in_month"]
                  : xKey === "ageInYear"
                    ? (variables["age_in_day"] as number) / DAY_IN_YEARS
                    : 0
            ) as number;
            return {
              x: xScale(xValue) as number,
              y: yScale(yAxis) as number,
              yValue: yAxis as number,
              xValue,
            };
          });

          return (
            <React.Fragment key={id}>
              <MemoLine
                points={plottedPoints}
                color={lineColor}
                strokeWidth={1}
                curveType="linear"
              />
              <MemoScatter
                points={plottedPoints}
                color={lineColor}
                radius={4}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
export interface LegendItemProps {
  color: string;
  label: string;
}
export const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => {
  return (
    <Pressable className="w-fit flex-row items-center gap-2 rounded-xl bg-background-primary p-1">
      <Box
        style={{
          backgroundColor: color,
        }}
        className="h-v-1 w-5"
      />
      <Text className="w-fit max-w-fit font-body text-2xs font-normal text-typography-primary">
        {label}
      </Text>
    </Pressable>
  );
};
