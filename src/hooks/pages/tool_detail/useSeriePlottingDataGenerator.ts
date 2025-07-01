import { GrowthIndicatorRange, GrowthRefChartAndTableCodes } from "@/core/constants";
import { AnthropometricVariableObject } from "@/core/diagnostics";
import { getSerieColor } from "@/src/constants/ui";
import { useUI } from "@/src/context";
import { ChartMeasurementSerie } from "@/src/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";


export type PlottedPointData = {
    variables: AnthropometricVariableObject
    xAxis: number
    yAxis: number
    zScore: number
    zScoreRange: GrowthIndicatorRange
}
export type PlottedSerieData = {
    label: string
    id: string
    data: PlottedPointData[]
    ui: {
        lineColor: string

    }
}

export function useSeriePlottingDataGenerator(chartCode: GrowthRefChartAndTableCodes) {
    const selectedMeasurementSeries = useSelector<any, { serieId: string }[]>(state => state.chartToolStoreReducer.growthMeasurements[chartCode]?.selectedSeries) || []
    const allMeasurementSeries = useSelector<any, ChartMeasurementSerie[]>(
        state => state.chartToolStoreReducer.growthMeasurements[chartCode]?.series
    ) || []
    const { colorMode } = useUI()
    const plottedSeriesData = useMemo<PlottedSerieData[]>(() => {
        if (selectedMeasurementSeries || (selectedMeasurementSeries as any).length === 0) {
            const plottedSeries: PlottedSerieData[] = []
            for (let index = 0; index < selectedMeasurementSeries.length; index++) {
                const { serieId } = selectedMeasurementSeries[index]
                const currentSerie = allMeasurementSeries.find(serie => serie.id === serieId)
                if (currentSerie) {
                    const plottedSerieData: PlottedSerieData = {
                        data: currentSerie.data.map((rawMeasurement) => ({
                            variables: rawMeasurement.results.variables,
                            xAxis: rawMeasurement.results.growthIndicatorValue.computedValue[0],
                            yAxis: rawMeasurement.results.growthIndicatorValue.computedValue[1],
                            zScore: rawMeasurement.results.growthIndicatorValue.value,
                            zScoreRange: rawMeasurement.results.growthIndicatorValue.valueRange
                        })),
                        label: currentSerie.label,
                        id: currentSerie.id,
                        ui: { lineColor: getSerieColor(index, colorMode), }
                    }
                    plottedSeries.push(plottedSerieData)
                }
            }
            return plottedSeries
        }
        return []
    }, [selectedMeasurementSeries, allMeasurementSeries, colorMode])
    return { plottedSeriesData }
}