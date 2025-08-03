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
} from "nxhermane_victory-native";
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
  const { data: medicalRecord, error, onLoading } = useMedicalRecord();
  const { plottedData } = useAnthropometricTrendsChartPointGenerator(
    dateToX,
    medicalRecord
  );

  if (onLoading) return <Loading />;
  console.log(plottedData, data);

  return (
    <VStack className="h-v-56 px-4 py-v-1">
      <VStack className="flex-1 rounded-lg">
        <TemporalTrendsInterativeChart
          data={data}
          plottedSeriesData={[
            { label: "Weight", color: "blue", data: plottedData },
          ]}
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
}

export const TemporalTrendsInterativeChart: React.FC<
  TemporalTrendsInterativeChartProps
> = ({ data, plottedSeriesData }) => {
  const font = useFont(Poppins_500Medium, 8);
  const transformState = useChartTransformState({
    scaleX: 1,
    scaleY: 1.0,
  });
  return (
    <CartesianChart
      data={data}
      xKey={"x"}
      xAxis={{ font }}
      yAxis={[
        {
          font,
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
