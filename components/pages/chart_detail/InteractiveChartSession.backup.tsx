import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  ChartDataDto,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
  GrowthRefChartAndTableCodes,
  GrowthReferenceChartDto,
} from "@/core/diagnostics";
import { AxisLabel, CHART_UI_DATA } from "@/src/constants/ui";
import { useUI } from "@/src/context";
import { ChartUiDataType, DisplayMode } from "@/src/hooks";
import { Poppins_200ExtraLight } from "@expo-google-fonts/poppins";
import {
  useFont,
  Text as SkiaText,
  Line as SkiaLine,
  center,
  Group,
  Circle,
  AnimatedProp,
} from "@shopify/react-native-skia";
import React, { useEffect, useRef, useState } from "react";
import colors from "tailwindcss/colors";
import {
  CartesianChart,
  Line,
  useChartTransformState,
  useChartPressState,
  CartesianActionsHandle,
} from "victory-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import { Pressable } from "@/components/ui/pressable";
import { Gesture } from "react-native-gesture-handler";
type ChildPlotedPointData = ((
  | {
      ageInDays: number;
      ageInMonths: number;
      ageInYears: number;
    }
  | { lenhei: number }
) & {
  value: number;
})[];
type ChartData = (
  | {
      ageInDays: number;
      ageInMonths: number;
      ageInYears: number;
    }
  | { lenhei: number }
) & {
  SD4neg: number;
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  SD0: number;
  SD2: number;
  SD3: number;
  SD1: number;
  SD4: number;
};
type ChartTransformStateConfig = {
  scaleX?: number; // Initial X-axis scale
  scaleY?: number; // Initial Y-axis scale
};
const AnimatedSkiaLine = Animated.createAnimatedComponent(SkiaLine);
const LenHeiBasedMode = ["length", "height"];

export interface InteractiveChartSessionProps {
  title?: string;
  growthChartDto?: GrowthReferenceChartDto;
}
export const InteractiveChartSession: React.FC<
  InteractiveChartSessionProps
> = ({ title, growthChartDto }) => {
  const font = useFont(Poppins_200ExtraLight, 10);
  const { colorMode } = useUI();
  const [data, setData] = useState<ChartData[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("years");
  const [activateZoom, setActiveZoom] = useState<boolean>(false);
  const [chartUiData, setChartUiData] = useState<ChartUiDataType | null>(null);

  const [childPlotedPointData, setChildPlotedPointData] =
    useState<ChildPlotedPointData>([
      {
        value: 3,
        ageInDays: 100,
        ageInMonths: 100 / DAY_IN_MONTHS,
        ageInYears: 100 / DAY_IN_YEARS,
      },
      {
        value: 7,
        ageInDays: 150,
        ageInMonths: 150 / DAY_IN_MONTHS,
        ageInYears: 150 / DAY_IN_YEARS,
      },
      {
        value: 8,
        ageInDays: 200,
        ageInMonths: 200 / DAY_IN_MONTHS,
        ageInYears: 200 / DAY_IN_YEARS,
      },
    ]);
  const transformState = useChartTransformState({
    scaleX: 1,
    scaleY: 1.0,
  });
  const { state: fisrtPress, isActive: isFirstPressActive } =
    useChartPressState({
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
  const actionsRef = useRef<CartesianActionsHandle<typeof fisrtPress>>(null);
  const tapGesture = Gesture.Tap().onStart(e => {
    fisrtPress.isActive.value = true;
    actionsRef.current?.handleTouch(fisrtPress, e.x, e.y);
  });
  const composed = Gesture.Race(tapGesture);

  useEffect(() => {
    const loadData = () => {
      if (growthChartDto) {
        const $chart_ui_data =
          CHART_UI_DATA[growthChartDto.code as keyof typeof CHART_UI_DATA];
        setChartUiData($chart_ui_data);
        if (LenHeiBasedMode.includes($chart_ui_data.defaultDisplayMode)) {
          const processedData = [] as any[];
          const lenheiInterval = 10;
          growthChartDto.data.forEach(({ value, curvePoints }, index) => {
            if (
              index % lenheiInterval ||
              index === growthChartDto.data.length - 1
            ) {
              const lenhei = value;
              const mappedData = {
                lenhei,
                ...curvePoints,
              };
              processedData.push(mappedData);
            }
          });
          setData(processedData);
        } else {
          if (
            !$chart_ui_data.availableDisplayMode.includes(displayMode as never)
          ) {
            return;
          }
          const dayInterval = displayMode === "months" ? 30 : 90;
          const processedData = [] as any[];
          growthChartDto.data.forEach(({ value, curvePoints }, index) => {
            if (
              index % dayInterval ||
              index === growthChartDto.data.length - 1
            ) {
              const ageInDays =
                $chart_ui_data.defaultDisplayMode === "years"
                  ? value * DAY_IN_YEARS
                  : value;
              const ageInMonths = ageInDays / DAY_IN_MONTHS;
              const ageInYears = ageInDays / DAY_IN_YEARS;

              const mappedData = {
                ageInDays,
                ageInMonths: parseFloat(ageInMonths.toFixed(1)),
                ageInYears: parseFloat(ageInYears.toFixed(2)),
                ...curvePoints,
              };
              processedData.push(mappedData);
            }
          });
          setData(processedData);
        }
      }
    };
    loadData();
  }, [growthChartDto, displayMode]);
  useEffect(() => {
    if (chartUiData) {
      console.log(chartUiData);
      setDisplayMode(chartUiData.defaultDisplayMode);
    }
  }, [chartUiData]);

  return (
    <VStack className="mx-2 rounded-xl bg-background-secondary px-2 py-v-2">
      <HStack>
        {title && (
          <Heading
            className={"font-h3 text-lg font-semibold text-typography-primary"}
          >
            {title}
          </Heading>
        )}
      </HStack>
      <VStack className="h-v-80 w-full rounded-lg bg-gray-100 dark:bg-background-primary">
        <HStack className="flex-1">
          {/* <Box className="h-[100%] w-10 items-center justify-center">
            <Text className="w-v-64 origin-bottom-left -rotate-90 text-center font-light text-xs color-gray-600 dark:color-gray-300">
              {chartUiData?.yAxisLabel}
            </Text>
          </Box> */}
          <Box className="flex-1">
            <CartesianChart
              actionsRef={actionsRef}
              customGestures={composed}
              transformState={activateZoom ? transformState.state : undefined}
              transformConfig={{
                // pan: {
                //   activateAfterLongPress: 100,
                //   dimensions: ["x", "y"],
                // },
                pinch: {
                  dimensions: ["x", "y"],
                },
              }}
              chartPressState={!activateZoom ? [fisrtPress] : undefined}
              data={data}
              xKey={
                (LenHeiBasedMode.includes(displayMode)
                  ? "lenhei"
                  : displayMode === "months"
                    ? "ageInMonths"
                    : "ageInYears") as any
              }
              yKeys={[
                "SD4neg",
                "SD3neg",
                "SD2neg",
                "SD1neg",
                "SD0",
                "SD1",
                "SD2",
                "SD3",
                "SD4",
              ]}
              xAxis={{
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
                formatXLabel(label) {
                  return label.toString() + "m";
                },
              }}
              yAxis={[
                {
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
                  formatYLabel: label => label.toString() + "kg",
                },
              ]}
              frame={{
                lineColor:
                  colorMode === "light"
                    ? `${colors.transparent}`
                    : `${colors.transparent}`,
              }}
              chartPressConfig={{
                pan: {
                  activateAfterLongPress: 0,
                  activeOffsetX: 0,
                  activeOffsetY: 0,
                  failOffsetX: 0,
                  failOffsetY: 0,
                },
              }}
              renderOutside={({
                points,
                canvasSize,
                xScale,
                chartBounds,
                xTicks,
                yScale,
                yTicks,
              }) => {
                const plottedPoints = childPlotedPointData.map(
                  (childData: any) => ({
                    y: yScale(childData.value) as number,
                    yValue: childData.value,
                    x: xScale(childData.ageInMonths) as number,
                  })
                );
                return (
                  <React.Fragment>
                    <SkiaText
                      font={font}
                      text={"4"}
                      x={0}
                      y={yScale(3)}
                      color={"white"}
                      strokeWidth={4}
                    ></SkiaText>
                  </React.Fragment>
                );
              }}
              
            >
              {({ points, canvasSize, xScale, yScale, yTicks }) => {
                const plottedPoints = childPlotedPointData.map(
                  (childData: any) => ({
                    y: yScale(childData.value) as number,
                    x: xScale(childData.ageInMonths) as number,
                  })
                );
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
                    {plottedPoints.map(value => {
                      return (
                        <React.Fragment key={value.y}>
                          <Circle
                            cx={value.x}
                            cy={value.y}
                            r={4}
                            color={colors.blue["500"]}
                          />
                        </React.Fragment>
                      );
                    })}

                    {isFirstPressActive && (
                      <React.Fragment>
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD4neg.position}
                          color={colors.red["700"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD3neg.position}
                          color={colors.red["500"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD2neg.position}
                          color={colors.orange["400"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD1neg.position}
                          color={colors.yellow["300"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD0.position}
                          color={colors.green["500"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD1.position}
                          color={colors.sky["400"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD2.position}
                          color={colors.indigo["500"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD3.position}
                          color={colors.purple["500"]}
                        />
                        <ToolTip
                          x={fisrtPress.x.position}
                          y={fisrtPress.y.SD4.position}
                          color={colors.rose["600"]}
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              }}
            </CartesianChart>
          </Box>
        </HStack>
        {/* <Box className="ml-10 h-9 items-center justify-center">
          <Text className="text-center font-light text-xs color-gray-600 dark:color-gray-300">
            {displayMode === "months"
              ? AxisLabel.age_month
              : displayMode === "years"
                ? AxisLabel.age_years
                : growthChartDto?.code ===
                    GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART
                  ? AxisLabel.lenhei
                  : displayMode === "height"
                    ? AxisLabel.height
                    : displayMode === "length"
                      ? AxisLabel.length
                      : ""}
          </Text>
        </Box> */}
      </VStack>
      <Pressable onPress={() => setActiveZoom(prev => !prev)}>
        <Text>ActivateZoom</Text>
      </Pressable>
    </VStack>
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




