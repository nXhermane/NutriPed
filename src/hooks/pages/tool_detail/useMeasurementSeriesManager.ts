import { ChartDetailMenuOtpionData } from "@/src/constants/ui";
import { useCallback, useEffect, useState } from "react";
import { usePicker } from "../../usePicker";
import {
  addNewSerie,
  AppDispatch,
  ChartMeasurementSerie,
  deleteMeasureFromSerie,
  deleteSerie,
} from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { GrowthRefChartAndTableCodes } from "@/core/constants";
import {
  addMeasureToSerie,
  ChartMeasurement,
  recordSelectedSeries,
} from "@/src/store/chartToolStore";
import { useToast } from "@/src/context";
import { Alert } from "react-native";
import { usePediatricApp } from "@/adapter";
import { Sex } from "@/core/shared";
type SeriesAction =
  | { type: "addMeasure"; payload: AddMeasurePayload }
  | { type: "new"; payload: NewSeriesPayload }
  | { type: "delete"; payload: DeleteSeriesPayload }
  | { type: "deleteSerie"; payload: DeleteSeriePayload }
  | { type: "choose"; payload: ChooseSeriePayload }
  | { type: "deleteMeasure"; payload: DeleteMeasurePayload };

// Définis chaque payload selon tes besoins
type AddMeasurePayload = {
  /* ... */
};
type NewSeriesPayload = void;
type DeleteSeriesPayload = {
  /* ... */
};
type DeleteSeriePayload = string; // exemple
type ChooseSeriePayload = { serieId: string };
type DeleteMeasurePayload = string;

type HandleSeriesAction = <T extends SeriesAction["type"]>(
  action: T
) => (
  payload: Extract<SeriesAction, { type: T }>["payload"]
) => Promise<any> | any;

type ActionCodeItemKeyType =
  | (typeof ChartDetailMenuOtpionData)[number]["key"]
  | "deleteMeasure"
  | "deleteSerie"
  | "addMeasure" | "multipleSelection"

export function useMeasurementSeriesManager(
  chartCode: GrowthRefChartAndTableCodes,
  sex: Sex,
  indicatorCode: string
) {
  const {
    closePicker: closeSeriesLabelModal,
    isOpen: isSeriesLabelModalOpen,
    openPicker: openLabelPicker,
  } = usePicker<{ serieLabel: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const measurementSeries = useSelector<any, ChartMeasurementSerie[]>(
    state => state.chartToolStoreReducer.growthMeasurements[chartCode]?.series
  );
  const [selectedSerie, setSelectedSerie] = useState<{
    serieId: string;
  } | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<{ serieId: string }[]>([])
  const {
    diagnosticServices: { growthIndicatorValue },
  } = usePediatricApp();


  useEffect(() => {
    if (chartCode)
      dispatch(recordSelectedSeries({ chartCode, selectedSeries }))
  }, [JSON.stringify(selectedSeries)])

  const handleSeriesAction = useCallback(
    (value: ActionCodeItemKeyType) => {
      if (!chartCode || !sex || !indicatorCode) return () => { };
      switch (value) {
        case "new": {
          return async () => {
            const returnValue = await openLabelPicker();
            if (!returnValue) return null;
            dispatch(
              addNewSerie({
                chartCode: chartCode,
                serieLabel: returnValue.serieLabel,
              })
            );
            return void 0;
          };
        }
        case "choose": {
          return ({ serieId }: { serieId: string }) => {
            if (selectedSerie === null) {
              setSelectedSerie({ serieId });
              setSelectedSeries([])
            }
            else {
              setSelectedSerie(null);
              setSelectedSeries([])
            }
          };
        }
        case "multipleSelection": {
          return ({ serieId }: { serieId: string }) => {
            if (selectedSerie != null) {
              setSelectedSeries(prev => {
                let series = []
                if (prev.length === 0) {
                  series.push(selectedSerie)
                  if (serieId === selectedSerie.serieId) return series
                }
                const findedIndex = prev.findIndex(serie => serie.serieId === serieId)
                if (findedIndex === -1) series = [...series, ...prev, { serieId }]
                else series = prev.filter(serie => serie.serieId != serieId || serie.serieId === selectedSerie.serieId)
                return series
              })

            }
          }
        }
        case "delete": {
          return () => {
            if (!measurementSeries) return void 0;
            Alert.alert(
              "Confirmation de l'action",
              "Voulez-vous vraiment supprimer toutes les series de mesures de cette courbe de croissance ? ",
              [
                {
                  text: "Oui",
                  onPress() {
                    const serieIds = measurementSeries.map(serie => serie.id);
                    serieIds.forEach(serieId =>
                      dispatch(deleteSerie({ chartCode, serieId }))
                    );
                  },
                  isPreferred: true,
                  style: "default",
                },
                {
                  text: "Non",
                  style: "destructive",
                  onPress: () => {
                    return void 0;
                  },
                },
              ]
            );
            return void 0;
          };
        }
        case "deleteSerie": {
          return (serieId: string) => {
            if (!measurementSeries) return void 0;
            const findedSerie = measurementSeries.find(
              serie => serie.id === serieId
            );
            if (!findedSerie) return;
            Alert.alert(
              "Confirmation de l'action",
              `Voulez-vous vraiment supprimer la serie de mesures ${findedSerie.label}? `,
              [
                {
                  text: "Oui",
                  onPress() {
                    dispatch(deleteSerie({ chartCode, serieId }));
                  },
                  isPreferred: true,
                  style: "default",
                },
                {
                  text: "Non",
                  style: "destructive",
                  onPress: () => {
                    return void 0;
                  },
                },
              ]
            );
          };
        }
        case "deleteMeasure": {
          return (measurementId: string) => {
            if (selectedSerie) {
              dispatch(
                deleteMeasureFromSerie({
                  chartCode,
                  measurementId,
                  serieId: selectedSerie.serieId,
                })
              );
              return void 0;
            }
            toast.show(
              "Info",
              "Mesure non supprimer.",
              "Vous devez choisir une serie de mesure avant de supprimer. Appuis long sur la serie que vous voulez choisir."
            );
          };
        }
        case "addMeasure": {
          return async (data: ChartMeasurement["data"]) => {
            if (selectedSerie) {
              const result = await growthIndicatorValue.calculateIndicator({
                anthropometricData: {
                  anthropometricMeasures: Object.values(data).filter(
                    value => typeof value != "number" && value.code != "lenhei"
                  ),
                },
                age_in_day: (data["age_in_day"] as number) || 0,
                age_in_month: (data["age_in_month"] as number) || 0,
                indicatorCode: indicatorCode,
                sex: sex,
              });
              if ("data" in result) {
                dispatch(
                  addMeasureToSerie({
                    chartCode,
                    serieId: selectedSerie.serieId,
                    measurement: data,
                    results: {
                      variables: result.data.variables,
                      growthIndicatorValue: result.data.growthIndicatorValue,
                    },
                  })
                );
                console.log(result)
                return true;
              } else {
                console.log("Error", result);
              }
            }
            toast.show(
              "Info",
              "Mesure non ajouter.",
              "Vous devez choisir une serie de mesure avant d'ajouter.Appuis long sur la serie que vous voulez choisir."
            );
            return null;
          };
        }
        default: {
          console.warn(
            "This key is not supported on chart tools action.[key]:",
            value
          );
          return () => { };
        }
      }
    },
    [measurementSeries, chartCode, selectedSerie, sex, indicatorCode]
  );

  return {
    handleSeriesAction,
    closeSeriesLabelModal,
    isSeriesLabelModalOpen,
    selectedSerie,
    measurementSeries,
    selectedSeries,
  };
}
