import { GrowthIndicatorRange } from "@/core/constants";
import { getSerieColor } from "@/src/constants/ui";
import { useUI } from "@/src/context";
import { useMemo } from "react";
import { SelectedChartMeasurementSerie } from "./useMeasurementSeriesManager";

export type PlottedPointData = {
  xAxis: number;
  yAxis: number;
  zScore: number;
  zScoreRange: GrowthIndicatorRange;
};
export type PlottedSerieData = {
  label: string;
  id: string;
  data: PlottedPointData[];
  ui: {
    lineColor: string;
  };
};

export function useSeriePlottingDataGenerator(
  selectedSeries?: SelectedChartMeasurementSerie[]
) {
  const { colorMode } = useUI();
  const plottedSeriesData = useMemo<PlottedSerieData[]>(() => {
    if (selectedSeries) {
      const plottedSeries: PlottedSerieData[] = [];
      for (let index = 0; index < selectedSeries.length; index++) {
        const currentSerie = selectedSeries[index];

        if (currentSerie) {
          const plottedSerieData: PlottedSerieData = {
            data: currentSerie.data.map(rawMeasurement => ({
              xAxis:
                rawMeasurement.results.growthIndicatorValue.computedValue[0],
              yAxis:
                rawMeasurement.results.growthIndicatorValue.computedValue[1],
              zScore: rawMeasurement.results.growthIndicatorValue.value,
              zScoreRange:
                rawMeasurement.results.growthIndicatorValue.valueRange,
            })),
            label: currentSerie.label,
            id: currentSerie.id,
            ui: { lineColor: getSerieColor(index, colorMode) },
          };
          plottedSeries.push(plottedSerieData);
        }
      }
      return plottedSeries;
    }
    return [];
  }, [selectedSeries, colorMode]);
  return { plottedSeriesData };
}
