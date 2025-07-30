import { usePediatricApp } from "@/adapter";
import { AnthropometricMeasureDto, GetAnthropometricMeasureRequest } from "@/core/diagnostics";
import { useEffect, useState } from "react";

export function useAnthropometricMeasure(req?: GetAnthropometricMeasureRequest) {
    const { diagnosticServices: { anthropometricMeasure } } = usePediatricApp()
    const [anthropometricMeasures, setAnthropometricMeasure] = useState<AnthropometricMeasureDto[]>([])
    const [error, setError] = useState<string | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)

    useEffect(() => {
        const getMeasures = async () => {
            setError(null)
            setOnLoading(true)
            const result = await anthropometricMeasure.get(req ? req : {})
            if ('data' in result) {
                setAnthropometricMeasure(result.data)
            } else {
                console.log(JSON.parse(result.content))
                setError(JSON.parse(result.content))
            }

            setOnLoading(false)
        }
        getMeasures()
    }, [req])
    return { data: anthropometricMeasures, error, onLoading }
}