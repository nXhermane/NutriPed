import { ChartDetailMenuOtpionData } from "@/src/constants/ui";
import { useCallback, useState } from "react";
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
} from "@/src/store/chartToolStore";
import { useToast } from "@/src/context";
import { Alert } from "react-native";

type ActionCodeItemKeyType =
  | (typeof ChartDetailMenuOtpionData)[number]["key"]
  | "deleteMeasure"
  | "deleteSerie"
  | "addMeasure";

export function useChartDetailHandler(chartCode: GrowthRefChartAndTableCodes) {
  const {
    closePicker: closeLabelPicker,
    isOpen: labelPickerIsOpen,
    openPicker: openLabelPicker,
  } = usePicker<{ serieLabel: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const chartSeries = useSelector<any, ChartMeasurementSerie[]>(
    state => state.chartToolStoreReducer.growthMeasurements[chartCode]?.series
  );
  const [selectedSerie, setSelectedSerie] = useState<{
    serieId: string;
  } | null>(null);

  const handleAction = useCallback(
    (value: ActionCodeItemKeyType) => {
      if (!chartCode) return () => { };
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
            if (selectedSerie === null) setSelectedSerie({ serieId });
            else setSelectedSerie(null)
          };
        }
        case "delete": {
          return () => {
            if (!chartSeries) return void 0;
            Alert.alert("Confirmation de l'action", "Voulez-vous vraiment supprimer toutes les series de mesures de cette courbe de croissance ? ", [{
              text: "Oui", onPress() {
                const serieIds = chartSeries.map(serie => serie.id);
                serieIds.forEach(serieId =>
                  dispatch(deleteSerie({ chartCode, serieId }))
                );
              },
              isPreferred: true,
              style: 'default'
            }, {
              text: "Non",
              style: "destructive",
              onPress: () => {
                return void 0
              }
            }])
            return void 0;
          };
        }
        case "deleteSerie": {
          return (serieId: string) => {
            if (!chartSeries) return void 0;
            const findedSerie = chartSeries.find(serie => serie.id === serieId)
            if (!findedSerie) return
            Alert.alert("Confirmation de l'action", `Voulez-vous vraiment supprimer la serie de mesures ${findedSerie.label}? `, [{
              text: "Oui", onPress() {
                dispatch(deleteSerie({ chartCode, serieId }));
              },
              isPreferred: true,
              style: 'default'
            }, {
              text: "Non",
              style: "destructive",
              onPress: () => {
                return void 0
              }
            }])

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
              return void 0
            }
            toast.show(
              "Info",
              "Mesure non supprimer.",
              "Vous devez choisir une serie de mesure avant de supprimer. Appuis long sur la serie que vous voulez choisir."
            );
          };
        }
        case "addMeasure": {
          return (data: ChartMeasurement["data"]) => {
            if (selectedSerie) {
              dispatch(
                addMeasureToSerie({
                  chartCode,
                  serieId: selectedSerie.serieId,
                  measurement: data,
                })
              );
              return true
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
    [chartSeries, chartCode, selectedSerie]
  );

  return {
    handleAction,
    closeLabelPicker,
    labelPickerIsOpen,
    selectedSerie,
    series: chartSeries,
  };
}
