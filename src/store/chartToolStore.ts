import {
  AnthroSystemCodes,
  GrowthRefChartAndTableCodes,
} from "@/core/constants";
import {
  AnthropometricVariableObject,
  GrowthIndicatorValueDto,
} from "@/core/evaluation";
import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
export type ChartMeasurement = {
  data: Partial<
    {
      [k in AnthroSystemCodes]: {
        value: number;
        code: AnthroSystemCodes;
        unit: string;
      };
    } & {
      [AnthroSystemCodes.AGE_IN_DAY]: number;
      [AnthroSystemCodes.AGE_IN_MONTH]: number;
    }
  >;
  id: string;
  results: {
    variables: AnthropometricVariableObject;
    growthIndicatorValue: GrowthIndicatorValueDto;
  };
};
export type ChartMeasurementSerie = {
  id: string;
  label: string;
  data: ChartMeasurement[];
  createdAt: string;
  updatedAt: string;
};

type AddMeasureToSerieReducerData = {
  chartCode: GrowthRefChartAndTableCodes;
  serieId: string;
  measurement: ChartMeasurement["data"];
  results: ChartMeasurement["results"];
};
type DeleteMeasureFromSerieReducerData = {
  chartCode: GrowthRefChartAndTableCodes;
  serieId: string;
  measurementId: string;
};
type AddNewSerieData = {
  chartCode: GrowthRefChartAndTableCodes;
  serieLabel: string;
};
type DeleteSerieData = {
  chartCode: GrowthRefChartAndTableCodes;
  serieId: string;
};
type RecordSelectedSeriesData = {
  chartCode: GrowthRefChartAndTableCodes;
  selectedSeries: { serieId: string }[];
};
export interface IChartToolStore {
  growthMeasurements: Partial<{
    [key in GrowthRefChartAndTableCodes]: {
      series: ChartMeasurementSerie[];
      selectedSeries: { serieId: string }[];
    };
  }>;
}
const initialState: IChartToolStore = {
  growthMeasurements: {},
};

export const chartToolStore = createSlice({
  name: "ChartToolState",
  initialState,
  reducers: {
    addMeasureToSerie(
      state,
      {
        payload: { chartCode, measurement, serieId, results },
      }: PayloadAction<AddMeasureToSerieReducerData>
    ) {
      const growthChartSeries = state.growthMeasurements[chartCode]?.series;
      if (growthChartSeries) {
        const serieIndex = growthChartSeries.findIndex(
          serie => serie.id === serieId
        );
        if (serieIndex !== -1) {
          growthChartSeries[serieIndex].data.push({
            data: measurement,
            id: nanoid(),
            results,
          });
          growthChartSeries[serieIndex].updatedAt = new Date().toISOString();
        }
      }
    },
    deleteMeasureFromSerie(
      state,
      {
        payload: { chartCode, measurementId, serieId },
      }: PayloadAction<DeleteMeasureFromSerieReducerData>
    ) {
      const growthChartSeries = state.growthMeasurements[chartCode]?.series;
      if (growthChartSeries) {
        const serieIndex = growthChartSeries.findIndex(
          serie => serie.id === serieId
        );
        if (serieIndex !== -1) {
          const measurementIndex = growthChartSeries[serieIndex].data.findIndex(
            measurement => measurement.id === measurementId
          );
          if (measurementIndex !== -1)
            growthChartSeries[serieIndex].data.splice(measurementIndex, 1);
          growthChartSeries[serieIndex].updatedAt = new Date().toISOString();
        }
      }
    },
    addNewSerie(
      state,
      { payload: { chartCode, serieLabel } }: PayloadAction<AddNewSerieData>
    ) {
      if (!state.growthMeasurements[chartCode]) {
        state.growthMeasurements[chartCode] = {
          series: [],
          selectedSeries: [],
        };
      }
      const newSerie: ChartMeasurementSerie = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: [],
        label: serieLabel,
      };
      state.growthMeasurements[chartCode].series.push(newSerie);
    },
    deleteSerie(
      state,
      { payload: { chartCode, serieId } }: PayloadAction<DeleteSerieData>
    ) {
      if (state.growthMeasurements[chartCode]) {
        const serieIndex = state.growthMeasurements[chartCode].series.findIndex(
          serie => serie.id === serieId
        );
        if (serieIndex !== -1) {
          state.growthMeasurements[chartCode].series.splice(serieIndex, 1);
          state.growthMeasurements[chartCode].selectedSeries = [];
        }
      }
    },
    recordSelectedSeries(
      state,
      {
        payload: { chartCode, selectedSeries },
      }: PayloadAction<RecordSelectedSeriesData>
    ) {
      if (state.growthMeasurements[chartCode]) {
        state.growthMeasurements[chartCode].selectedSeries = selectedSeries;
      }
    },
  },
});

export const {
  addMeasureToSerie,
  addNewSerie,
  deleteMeasureFromSerie,
  deleteSerie,
  recordSelectedSeries,
} = chartToolStore.actions;
export const chartToolStoreReducer = chartToolStore.reducer;
