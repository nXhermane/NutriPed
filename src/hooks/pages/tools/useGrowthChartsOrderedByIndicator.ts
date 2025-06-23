import { useCallback } from "react";
import { GROWTH_INDICATORS } from "@/src/constants/ui";
import { GrowthReferenceChartDto } from "@/core/diagnostics";
import { useQuery } from "@tanstack/react-query";
import { usePediatricApp } from "@/adapter";
type ValueOf<T> = T[keyof T]
export type IndicatorUIType = ValueOf<typeof GROWTH_INDICATORS>
export type GrowthChartListOrderedByIndicatorType = {
    indicator: IndicatorUIType,
    data: { chart: GrowthReferenceChartDto, uiData: { label: string, by: string } }[]
}[]


export function useGrowthChartsOrderedByIndicator() {
    const { diagnosticServices: { growthChart } } = usePediatricApp()

    const orderedByIndicator = useCallback((data: GrowthReferenceChartDto[]) => {
        const growthChartsOrderdByIndicator: {
            [key: string]: {
                indicator: IndicatorUIType,
                data: { chart: GrowthReferenceChartDto, uiData: { label: string, by: string } }[]
            }
        } = {}
        const indicatorUiData = Object.entries(GROWTH_INDICATORS)
        for (const indicator of indicatorUiData) {
            const indicatorCharts = indicator[1].charts
            for (const [chartCode, uiData] of Object.entries(indicatorCharts)) {
                const chart = data.find(value => value.code === chartCode)
                if (chart) {
                    const chartWithUIData = {
                        chart,
                        uiData: uiData as { label: string, by: string }
                    }
                    if (growthChartsOrderdByIndicator[indicator[0]]) {
                        growthChartsOrderdByIndicator[indicator[0]].data.push(chartWithUIData)
                    } else {
                        growthChartsOrderdByIndicator[indicator[0]] = {
                            indicator: indicator[1] as IndicatorUIType,
                            data: [chartWithUIData]
                        }
                    }
                }
            }
        }
        return Object.values(growthChartsOrderdByIndicator)
    }, [GROWTH_INDICATORS])

    const fetchGrowthChartAndOrderedByIndicator = async () => {
        const result = await growthChart.get({})
        if ('data' in result) {
            return orderedByIndicator(result.data)
        } else {
            throw new Error(result.content)
        }
    }

    return useQuery({
        queryKey: ["growthChartsDataOnChartTools"],
        queryFn: fetchGrowthChartAndOrderedByIndicator,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        // BETA : 
    })
}