import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/src/context/pages";
import { uiBus } from "@/uiBus";
import { useCallback, useEffect, useState } from "react";

export function useGenerateNutritionalDiagnostic() {
    const { diagnosticServices: { nutritionalDiagnostic } } = usePediatricApp()
    const { patient } = usePatientDetail()
    const [error, setError] = useState<string | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const generate = useCallback(async () => {
        setError(null)
        setOnLoading(true)
        setIsSuccess(false)
        const result = await nutritionalDiagnostic.generateDiagnosticResult({ nutritionalDiagnosticId: patient.id })
        if ('data' in result) {
            setIsSuccess(true)
            uiBus.emit('nutritional:diagnostic:update')
        } else {
            const _errorContent = JSON.parse(result.content)
            console.error(_errorContent)
            setError(_errorContent)
        }
        setOnLoading(false)
    }, [patient, nutritionalDiagnostic])
    return { generate, error, onLoading, isSuccess }
}