import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { GrowthInteractiveChart } from "./GrowthChartInteractive";
import { ChartDataDto, GrowthRefChartAndTableCodes } from "@/core/diagnostics";
import {
  PlottedPointData,
  SelectedChartMeasurementSerie,
  useGrowthChartDataGenerator,
  useSeriePlottingDataGenerator,
} from "@/src/hooks/pages/tool_detail";
import { ChartUiDataType, DisplayMode } from "@/src/constants/ui";
import { GrowthChartInteractiveOptions } from "./GrowthChartInteractiveOptions";

export interface GrowthReferenceChartProps {
  code: GrowthRefChartAndTableCodes;
  chartData: ChartDataDto[];
  chartName: string;
  selectedSeries?: SelectedChartMeasurementSerie[];
  singlePlotteData?: PlottedPointData
}
export const GrowthReferenceChart: React.FC<GrowthReferenceChartProps> =
  React.memo(({ chartData, code, chartName, selectedSeries,singlePlotteData }) => {
    const [zoomActivate, setZoomActivate] = useState<boolean>(false);
    const {
      data,
      setDisplayedXAxisRange,
      setDisplayMode,
      chartUiData,
      displayMode,
      displayedXAxisRange,
    } = useGrowthChartDataGenerator(chartData, code);
    const { plottedSeriesData } = useSeriePlottingDataGenerator(selectedSeries);

    return (
      <VStack>
        <GrowthInteractiveChart
          data={data}
          displayMode={displayMode as DisplayMode}
          chartUiData={chartUiData as ChartUiDataType}
          chartName={chartName}
          zoomActivate={zoomActivate}
          plottedSeriesData={plottedSeriesData}
          singlePlotteData={singlePlotteData}
        />
        <GrowthChartInteractiveOptions
          chartUiData={chartUiData as ChartUiDataType}
          displayRange={
            displayedXAxisRange as
              | ChartUiDataType["availableDisplayRange"][number]["range"]
              | "all"
          }
          setDisplayRange={setDisplayedXAxisRange as any}
          displayMode={displayMode as DisplayMode}
          setDisplayMode={setDisplayMode}
          zoomActivate={zoomActivate}
          setZoomActivate={setZoomActivate}
        />
      </VStack>
    );
  });
