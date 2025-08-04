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

export interface AnthropometricMeasurementTrendsChartProps {
  range: { start: Date; end?: Date };
  gap: number;
}

export const AnthropometricMeasurementTrendsChart: React.FC<
  AnthropometricMeasurementTrendsChartProps
> = ({ gap, range }) => {
  const ajutedRange = useMemo(
    () => ({
      start: new Date(range.start.getTime() - 1000 * 60 * 60 * 24),
      end: new Date(
        (range.end ? range.end.getTime() : new Date().getTime()) +
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
      <VStack className="flex-1 rounded-lg">
        <TemporalTrendsInterativeChart
          data={data}
          plottedSeriesData={[
            { label: "Weight", color: "blue", data: plottedData },
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
  const font = useFont(Poppins_500Medium, 8);
  const transformState = useChartTransformState({
    scaleX: 1,
    scaleY: 1.0,
  });
  return (
    <CartesianChart
      data={data}
      xKey={"x"}
      xAxis={{
        font,
        formatXLabel(label) {
          const date = xToDate(label);

          return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            // dateStyle: 'short'
          });
        },
      }}
      yAxis={[
        {
          font,
          domain: [domain[0], domain[1] + 1],
          tickCount: domain[1] - domain[0],
        },
      ]}
      yKeys={["y"]}
      domainPadding={{ right: 10 }}
      padding={{
        left: 10,
        right: 10,
        bottom: 20,
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
