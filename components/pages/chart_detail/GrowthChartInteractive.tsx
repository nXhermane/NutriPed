import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { DAY_IN_MONTHS, DAY_IN_YEARS } from "@/core/diagnostics";
import {
  AxisLabel,
  CHART_LEGEND,
  ChartUiDataType,
  DisplayMode,
  LengthHeightMode,
} from "@/src/constants/ui";
import { useToast, useUI } from "@/src/context";
import {
  ChartDataPoint,
  PlottedPointData,
  PlottedSerieData,
} from "@/src/hooks";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { Circle, ImageFormat, useFont } from "@shopify/react-native-skia";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SharedValue } from "react-native-reanimated";
import colors from "tailwindcss/colors";
import {
  CartesianActionsHandle,
  CartesianChart,
<<<<<<< HEAD
  // CartesianChartRef,
=======
  CartesianChartRef,
>>>>>>> main
  Line,
  Scatter,
  useChartPressState,
  useChartTransformState,
} from "nxhermane_victory-native";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { Share } from "lucide-react-native";
import { Image } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { generateGrowthInteractiveChartPdf } from "@/data";

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

export interface GrowthInteractiveChartProps {
  data: ChartDataPoint[];
  displayMode: DisplayMode;
  chartUiData: ChartUiDataType;
  chartName: string;
  zoomActivate: boolean;
  plottedSeriesData: PlottedSerieData[];
  singlePlotteData?: PlottedPointData;
}
export const GrowthInteractiveChart: React.FC<GrowthInteractiveChartProps> = ({
  data,
  displayMode,
  chartUiData,
  chartName,
  zoomActivate,
  plottedSeriesData,
  singlePlotteData,
}) => {
  const font = useFont(Poppins_500Medium, 8);
  const toast = useToast();
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
<<<<<<< HEAD
  // const chartRef = useRef<CartesianChartRef<any>>(null);
=======
  const chartRef = useRef<CartesianChartRef<any>>(null);
>>>>>>> main
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
  // FIXME: fixer le warning => Reanimated] Tried to modify key `current` of an object which has been already passed to a worklet.
  // https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#tried-to-modify-key-of-an-object-which-has-been-converted-to-a-shareable
  // for more details.
  // const tapGesture = Gesture.Tap().onStart(e => {
  //   state.isActive.value = true;
  //   actionsRef.current?.handleTouch(state, e.x, e.y);
  // });
  // const composed = Gesture.Race(tapGesture);
  const [uri, setUri] = useState<string>();
  const showErrorMessage = useCallback(() => {
    toast.show(
      "Error",
      "Erreur technique",
      "Une erreur technique s'est produite lors de l'exportation de la courbe de croissance en pdf."
    );
  }, [toast]);
<<<<<<< HEAD
  // const printChart = useCallback(async () => {
  //   if (chartRef.current?.canvas) {
  //     setUri(undefined);
  //     // Get skia image of the chart
  //     const skImage = await chartRef.current.canvas.makeImageSnapshotAsync();
  //     const skImageInBase64 = skImage.encodeToBase64(ImageFormat.PNG, 100);
  //     setUri(`data:image/png;base64,${skImageInBase64}`);
  //     const printedFile = await Print.printToFileAsync({
  //       base64: true,
  //       html: generateGrowthInteractiveChartPdf({
  //         chartImageBase64: uri,
  //       }),
  //     });
  //     shareAsync(printedFile.uri, { UTI: ".pdf", mimeType: "application/pdf" });
  //   } else showErrorMessage();
  // }, [chartRef, showErrorMessage]);
=======
  const printChart = useCallback(async () => {
    if (chartRef.current?.canvas) {
      setUri(undefined);
      // Get skia image of the chart
      const skImage = await chartRef.current.canvas.makeImageSnapshotAsync();
      const skImageInBase64 = skImage.encodeToBase64(ImageFormat.PNG, 100);
      setUri(`data:image/png;base64,${skImageInBase64}`);
      const printedFile = await Print.printToFileAsync({
        base64: true,
        html: generateGrowthInteractiveChartPdf({
          chartImageBase64: uri,
        }),
      });
      shareAsync(printedFile.uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } else showErrorMessage();
  }, [chartRef, showErrorMessage]);
>>>>>>> main
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
      <VStack className="m-1 h-v-96 rounded-xl border-[1px] border-primary-border/10 bg-background-primary dark:border-0">
        <CartesianChart
<<<<<<< HEAD
          // ref={chartRef}
=======
          ref={chartRef}
>>>>>>> main
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
          // customGestures={composed}
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
          {({ points, xScale, yScale, canvasSize }) => {
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
                {singlePlotteData && (
                  <SinglePlotteRenderComponent
                    data={singlePlotteData}
                    xKey={xKey}
                    xScale={xScale}
                    yScale={yScale}
                    canvasSize={canvasSize}
                    color={colorMode === "dark" ? colors.white : colors.black}
                  />
                )}
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
        {/* <Pressable
          className="absolute -top-3 right-3 rounded-full bg-primary-c_light p-2"
          onPress={printChart}
        >
          <Icon as={Share} className="h-3 w-3 text-white" />
        </Pressable> */}
      </VStack>
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
      {/*  <VStack className="w-full">
        <Image
          source={{ uri: uri }}
          style={{
            width: "100%",
            height: 500,
          }}
          resizeMethod="auto"
          resizeMode="cover"
        />
      </VStack> */}
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
          const plottedPoints = serieData.map(({ xAxis, yAxis }) => {
            const xValue = (
              xKey === "lenhei"
                ? xAxis
                : xKey === "ageInMonth"
                  ? xAxis / DAY_IN_MONTHS
                  : xKey === "ageInYear"
                    ? xAxis / DAY_IN_YEARS
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
    <Pressable className="w-fit flex-row items-center gap-2 rounded-xl border-[1px] border-primary-border/10 bg-background-primary p-1 dark:border-0">
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

export interface SinglePlotteRenderComponentProps {
  data: PlottedPointData;
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  xKey: "lenhei" | "ageInMonth" | "ageInYear";
  canvasSize: { height: number; width: number };
  color: string;
}
export const SinglePlotteRenderComponent: React.FC<SinglePlotteRenderComponentProps> =
  React.memo(({ data, xKey, xScale, yScale, canvasSize, color }) => {
    const xValue = (
      xKey === "lenhei"
        ? data.xAxis
        : xKey === "ageInMonth"
          ? data.xAxis / DAY_IN_MONTHS
          : xKey === "ageInYear"
            ? data.xAxis / DAY_IN_YEARS
            : 0
    ) as number;
    const plottedPoint = {
      x: xScale(xValue) as number,
      y: yScale(data.yAxis) as number,
      yValue: data.yAxis as number,
      xValue,
    };

    return (
      <React.Fragment>
        <MemoScatter points={[plottedPoint]} color={color} radius={2} />
        <MemoLine
          points={[
            { x: plottedPoint.x, xValue: plottedPoint.xValue, y: 0, yValue: 0 },
            {
              x: plottedPoint.x,
              xValue: plottedPoint.xValue,
              y: canvasSize.height,
              yValue: canvasSize.height,
            },
          ]}
          color={color}
        />
        <MemoLine
          points={[
            { x: 0, xValue: 0, y: plottedPoint.y, yValue: plottedPoint.yValue },
            {
              x: canvasSize.width,
              xValue: canvasSize.width,
              y: plottedPoint.y,
              yValue: canvasSize.width,
            },
          ]}
          color={color}
        />
      </React.Fragment>
    );
  });
