import { Loading } from "@/components/custom";
import { VStack } from "@/components/ui/vstack";
import {
  AnthropometricPlottedPointData,
  PlottedPointData,
  useAnthropometricTrendsChartPointGenerator,
  useMedicalRecord,
} from "@/src/hooks";
import {
  TemporalChartPoint,
  useTemporalChartDataGenerator,
} from "@/src/hooks/utils";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { useFont } from "@shopify/react-native-skia";
import {
  CartesianChart,
  Line,
  Scatter,
  useChartTransformState,
} from "victory-native";
import React, { useMemo } from "react";
import { useUI } from "@/src/context";
import colors from "tailwindcss/colors";

export interface AnthropometricMeasurementTrendsChartProps {
  range: { start: Date; end?: Date };
  gap: number;
}

export const AnthropometricMeasurementTrendsChart: React.FC<
  AnthropometricMeasurementTrendsChartProps
> = ({ gap, range }) => {
  const { colorMode } = useUI();
  const ajutedRange = useMemo(
    () => ({
      start: new Date(range.start?.getTime() - 1000 * 60 * 60 * 24),
      end: new Date(
        (range.end ? range.end?.getTime() : new Date().getTime()) +
          1000 * 60 * 60 * 24
      ),
    }),
    [range]
  );
  const { data, dateToX, xToDate } = useTemporalChartDataGenerator(
    ajutedRange,
    gap
  );
  const { plottedData, error, onLoading, yPlottedDomain } =
    useAnthropometricTrendsChartPointGenerator(dateToX);

  if (onLoading)
    return (
      <VStack className="h-v-56 px-4 py-v-1">
        <Loading />
      </VStack>
    );

  return (
    <VStack className="h-v-64 px-4 py-v-1">
      <VStack className="flex-1 rounded-xl bg-background-secondary">
        <TemporalTrendsInterativeChart
          data={data}
          plottedSeriesData={[
            {
              label: "Weight",
              color:
                colorMode === "light" ? colors.blue["700"] : colors.blue["300"],
              data: plottedData,
            },
          ]}
          xToDate={xToDate}
          domain={yPlottedDomain}
        />
      </VStack>
    </VStack>
  );
};

export interface TemporalTrendsInterativeChartProps {
  data: TemporalChartPoint[];
  plottedSeriesData: {
    label: string;
    darkColor?: string;
    color: string;
    data: AnthropometricPlottedPointData[];
  }[];
  xToDate?: (x: number) => Date;
  domain: [minYValue: number, maxYValue: number];
}

export const TemporalTrendsInterativeChart: React.FC<
  TemporalTrendsInterativeChartProps
> = ({
  data,
  plottedSeriesData,
  xToDate = (x: number) => new Date(),
  domain,
}) => {
  const { colorMode } = useUI();
  const font = useFont(Poppins_500Medium, 8);
  const transformState = useChartTransformState({
    scaleX: 1,
    scaleY: 1.0,
  });
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
        const date = xToDate(label);

        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          // dateStyle: 'short'
        });
      },
    }),
    [colorMode, font, xToDate]
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
      domain: [domain[0], domain[1] + 1] as [number, number],
      tickCount: domain[1] - domain[0],
      formatYLabel: (label: number) => label.toString() + "kg",
    }),
    [colorMode, font, domain]
  );
  return (
    <CartesianChart
      data={data}
      xKey={"x"}
      xAxis={xAxisConfig}
      yAxis={[yAxisConfig]}
      yKeys={["y"]}
      domainPadding={{ right: 10 }}
      padding={{
        left: 10,
        right: 10,
        bottom: 10,
      }}
      transformState={transformState.state}
    >
      {({ points, xScale, yScale, canvasSize }) => {
        return (
          <React.Fragment>
            <TemporalTrendsPlottedRenderComponent
              plottedSeriesData={plottedSeriesData}
              xScale={xScale}
              yScale={yScale}
            />
          </React.Fragment>
        );
      }}
    </CartesianChart>
  );
};

export interface TemporalTrendsPlottedRenderComponentProps {
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  plottedSeriesData: {
    label: string;
    darkColor?: string;
    color: string;
    data: AnthropometricPlottedPointData[];
  }[];
}

export const TemporalTrendsPlottedRenderComponent: React.FC<
  TemporalTrendsPlottedRenderComponentProps
> = ({ plottedSeriesData, xScale, yScale }) => {
  return (
    <React.Fragment>
      {plottedSeriesData.map((data, index) => {
        const plottedPoints = data.data.map(val => ({
          x: xScale(val.xAxis),
          y: yScale(val.yAxis),
          xValue: val.xAxis,
          yValue: val.yAxis,
        }));

        return (
          <React.Fragment key={index}>
            <Line
              points={plottedPoints}
              color={data.color}
              strokeWidth={1}
              curveType="linear"
            />
            <Scatter points={plottedPoints} color={data.color} radius={4} />
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};
