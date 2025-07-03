import { usePediatricApp } from "@/adapter";
import { GetGrowthReferenceTableRequest, GrowthReferenceTableDto } from "@/core/diagnostics";
import { useEffect, useState } from "react";

export function useGrowthTables(request?: GetGrowthReferenceTableRequest) {
    const { diagnosticServices: { growthTable } } = usePediatricApp()
    const [growthTableList, setGrowthTableList] = useState<GrowthReferenceTableDto[]>([])
    const [error, setError] = useState<string | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)

    useEffect(() => {
        const getGrowthTables = async () => {
            setError(null)
            setOnLoading(true)
            const result = await growthTable.get(request ? request : {})
            if ('data' in result) {
                setGrowthTableList(result.data)
            } else {
                console.error(result.content)
            }
            setOnLoading(false)
        }
        getGrowthTables()
    }, [growthTable, request])

    return { data: growthTableList, onLoading, error }
}