import { usePediatricApp } from "@/adapter";
import { NutritionalDiagnosticDto } from "@/core/diagnostics";
import { usePatientDetail } from "@/src/context/pages";
import { useEffect, useState } from "react";

export function useNutritionalDiagnostic() {
    const { diagnosticServices: { nutritionalDiagnostic: nutritionalDiagnosticService } } = usePediatricApp()
    const [error, setError] = useState<string | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)
    const [nutritionalDiagnostic, setNutritionalDiagnostic] = useState<NutritionalDiagnosticDto | null>(null)
    const { patient } = usePatientDetail()
    useEffect(() => {
        const getNutritionalDiagnostic = async () => {
            setError(null)
            setNutritionalDiagnostic(null)
            setOnLoading(true)
            const result = await nutritionalDiagnosticService.get({ patientIdOrId: patient.id })
            if ('data' in result) {
                setNutritionalDiagnostic(result.data[0])
            } else {
                const _errorContent = JSON.parse(result.content)
                console.error(_errorContent)
                setError(_errorContent)
            }
            setOnLoading(false)
        }
        getNutritionalDiagnostic()

    }, [patient])

    return { data: nutritionalDiagnostic, error, onLoading }
}