import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ChartDataDto, GrowthReferenceChartDto } from "@/core/diagnostics";
import React, { useEffect, useState } from "react";
import { CartesianChart, Line } from "victory-native";
type FlatChartData = Omit<ChartDataDto, "curvePoints"> &
  Record<string, number> & { index: number };

export interface InteractiveChartSessionProps {
  title?: string;
  growthChartDto?: GrowthReferenceChartDto;
}
export const InteractiveChartSession: React.FC<
  InteractiveChartSessionProps
> = ({ title, growthChartDto }) => {
  const [data, setData] = useState<FlatChartData[]>([]);
  useEffect(() => {
    if (growthChartDto)
      setData(
        growthChartDto.data.map(({ curvePoints, ...others }, index) => ({
          ...others,
          index,
          ...curvePoints,
        }))
      );
  }, [growthChartDto]);
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
      <VStack className="h-v-96 w-full">
        <CartesianChart data={data} xKey={"index"} yKeys={["value"]}>
          {({ points }) => {
            console.log(points)
            return <Line points={points.value} color="red" strokeWidth={3} />;
          }}
        </CartesianChart>
      </VStack>
    </VStack>
  );
};
