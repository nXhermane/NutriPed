import {
  ChartDataDto,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
  GrowthRefChartAndTableCodes,
} from "@/core/diagnostics";
import {
  CHART_UI_DATA,
  DisplayMode,
  LengthHeightMode,
} from "@/src/constants/ui";
import { useEffect, useMemo, useState } from "react";

export interface ChartDataXAxisPropsAgeBased {
  ageInDay: number;
  ageInMonth: number;
  ageInYear: number;
}
export interface ChartDataXAxisPropsLenHeiBased {
  lenhei: number;
}
export type ChartDataXAxisProps =
  | ChartDataXAxisPropsAgeBased
  | ChartDataXAxisPropsLenHeiBased;
export interface ChartDataYAxisProps {
  SD4neg: number;
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  SD0: number;
  SD2: number;
  SD3: number;
  SD1: number;
  SD4: number;
}

export type ChartDataPoint = ChartDataYAxisProps & ChartDataXAxisProps;

export function useGrowthChartDataGenerator(
  chartData: ChartDataDto[],
  code: GrowthRefChartAndTableCodes
) {
  const [chartUiData, setChartUiData] =
    useState<(typeof CHART_UI_DATA)[keyof typeof CHART_UI_DATA]>();
  const [displayMode, setDisplayMode] = useState<DisplayMode>();
  const [lenHeiInterval, setLenHeiInterval] = useState<number>(10);
  const [dayInterval, setDayInterval] = useState<number>();
  const [displayedXAxisRange, setDisplayedXAxisRange] = useState<
    [ChartDataXAxisProps, ChartDataXAxisProps] | "all"
  >("all");
  useEffect(() => {
    if (code) {
      const chart_ui_data = CHART_UI_DATA[code as keyof typeof CHART_UI_DATA];
      setChartUiData(chart_ui_data);
      setDisplayMode(chart_ui_data.defaultDisplayMode);
    }
  }, [code]);
  useEffect(() => {
    if (displayMode === "months") {
      setDayInterval(30);
    } else if (displayMode === "years") {
      setDayInterval(90);
    }
  }, [displayMode]);

  const generateData = useMemo(() => {
    if (chartUiData && chartData) {
      if (
        LengthHeightMode.includes(
          chartUiData.defaultDisplayMode as (typeof LengthHeightMode)[number]
        )
      ) {
        const processedData: ChartDataPoint[] = [];
        for (let index = 0; index <= chartData.length - 1; index++) {
          const { curvePoints, value } = chartData[index];

          if (displayedXAxisRange === "all") {
            processedData.push({
              lenhei: value,
              ...curvePoints,
            } as ChartDataPoint);
          } else {
            const displayedStart =
              displayedXAxisRange[0] as ChartDataXAxisPropsLenHeiBased;
            const displayedEnd =
              displayedXAxisRange[1] as ChartDataXAxisPropsLenHeiBased;
            if (
              (value === displayedStart.lenhei ||
                value === displayedEnd.lenhei) &&
              value >= displayedStart.lenhei &&
              value <= displayedEnd.lenhei
            ) {
              processedData.push({
                lenhei: value,
                ...curvePoints,
              } as ChartDataPoint);
            }
          }
        }
        return processedData;
      } else {
        if (
          !displayMode &&
          !chartUiData.availableDisplayMode.includes(displayMode as never)
        )
          return [];
        if (dayInterval) {
          const processedData: ChartDataPoint[] = [];
          for (let index = 0; index <= chartData.length - 1; index++) {
            const { curvePoints, value } = chartData[index];
            const ageInDays =
              chartUiData.defaultDisplayMode === "years"
                ? value * DAY_IN_MONTHS
                : value;
            const ageInMonths = ageInDays / DAY_IN_MONTHS;
            const ageInYears = ageInDays / DAY_IN_YEARS;
            if (displayedXAxisRange === "all") {
              if (index % dayInterval || index === chartData.length - 1) {
                processedData.push({
                  ageInDay: ageInDays,
                  ageInMonth: parseFloat(ageInMonths.toFixed(1)),
                  ageInYear: parseFloat(ageInYears.toFixed(2)),
                  ...curvePoints,
                } as ChartDataPoint);
              }
            } else {
              const displayedStart =
                displayedXAxisRange[0] as ChartDataXAxisPropsAgeBased;
              const displayedEnd =
                displayedXAxisRange[1] as ChartDataXAxisPropsAgeBased;
              if (
                (index % dayInterval ||
                  ageInDays === displayedStart.ageInDay ||
                  ageInDays === displayedEnd.ageInDay) &&
                ageInDays >= displayedStart.ageInDay &&
                ageInDays <= displayedEnd.ageInDay
              ) {
                processedData.push({
                  ageInDay: ageInDays,
                  ageInMonth: parseFloat(ageInMonths.toFixed(1)),
                  ageInYear: parseFloat(ageInYears.toFixed(2)),
                  ...curvePoints,
                } as ChartDataPoint);
              }
            }
          }
          return processedData;
        }
        return [];
      }
    }
    return [];
  }, [
    chartUiData,
    chartData,
    lenHeiInterval,
    displayMode,
    dayInterval,
    displayedXAxisRange,
  ]);

  return {
    data: generateData,
    setLenHeiInterval,
    setDisplayedXAxisRange,
    setDisplayMode,
    setDayInterval,
    displayMode,
    displayedXAxisRange,
    chartUiData,
  };
}
