import { usePediatricApp } from "@/adapter";
import { GrowthReferenceChartDto } from "@/core/diagnostics";
import { useEffect, useState } from "react";


export function useGrowthCharts() {
    const { diagnosticServices: { growthChart } } = usePediatricApp()
    const [growthChartList, setGrowthChartList] = useState<GrowthReferenceChartDto[]>([])
    useEffect(() => {
        const getGrowthCharts = async () => {
            const result = await growthChart.get({})
            if ('data' in result) {
                setGrowthChartList(result.data)
            } else {
                console.error(result.content)
            }
        }
        getGrowthCharts()
    }, [])
    return growthChartList
}