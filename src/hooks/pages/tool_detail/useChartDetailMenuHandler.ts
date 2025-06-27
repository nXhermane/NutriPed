import { ChartDetailMenuOtpionData } from "@/src/constants/ui";
import { useCallback, useState } from "react";
import { usePicker } from "../../usePicker";
import { addNewSerie, AppDispatch, ChartMeasurementSerie, deleteMeasureFromSerie, deleteSerie } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { GrowthRefChartAndTableCodes } from "@/core/constants";
import { addMeasureToSerie, ChartMeasurement } from "@/src/store/chartToolStore";
import { useToast } from "@/src/context";

type ActionCodeItemKeyType = typeof ChartDetailMenuOtpionData[number]['key'] | "deleteMeasure" | "deleteSerie" | "addMeasure"

export function useChartDetailHandler(chartCode: GrowthRefChartAndTableCodes) {
    const { closePicker: closeLabelPicker, isOpen: labelPickerIsOpen, openPicker: openLabelPicker } = usePicker<{ serieLabel: string }>()
    const dispatch = useDispatch<AppDispatch>()
    const toast = useToast()
    const chartSeries = useSelector<any, ChartMeasurementSerie[]>((state) =>
        state.chartToolStoreReducer.growthMeasurements[chartCode]?.series
    )
    const [selectedSerie, setSelectedSerie] = useState<{ serieId: string } | null>(null)

    const handleAction = useCallback((value: ActionCodeItemKeyType) => {
        if (!chartCode) return () => { }
        switch (value) {
            case "new": {
                return async () => {
                    const returnValue = await openLabelPicker()
                    if (!returnValue) return null
                    dispatch(addNewSerie({ chartCode: chartCode, serieLabel: returnValue.serieLabel }))
                    return void 0
                }
            }
            case "choose": {
                return async ({ serieId }: { serieId: string }) => {
                    setSelectedSerie({ serieId })
                }
            }
            case "delete": {
                return () => {
                    if (!chartSeries) return void 0
                    const serieIds = chartSeries.map((serie) => serie.id)
                    serieIds.forEach((serieId) => dispatch(deleteSerie({ chartCode, serieId })))
                    return void 0
                }
            }
            case "deleteSerie": {
                return (serieId: string) => {
                    dispatch(deleteSerie({ chartCode, serieId }))
                }
            }
            case "deleteMeasure": {
                return (measurementId: string) => {
                    if (selectedSerie) {
                        dispatch(deleteMeasureFromSerie({ chartCode, measurementId, serieId: selectedSerie.serieId }))
                    }
                }
            }
            case 'addMeasure': {
                return (data: ChartMeasurement["data"]) => {
                    if (selectedSerie) {
                        dispatch(addMeasureToSerie({ chartCode, serieId: selectedSerie.serieId, measurement: data }))
                        return void 0
                    }
                    toast.show("Info", "Mesure non ajouter.", "Vous devez choisir une serie de mesure avant d'ajouter.")
                    return null
                }
            }
            default: {
                console.warn("This key is not supported on chart tools action.[key]:", value)
                return () => { }
            }
        }
    }, [chartSeries, chartCode])

    return { handleAction, closeLabelPicker, labelPickerIsOpen, selectedSerie, series: chartSeries }
}
