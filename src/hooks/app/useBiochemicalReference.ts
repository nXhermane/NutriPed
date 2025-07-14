import { usePediatricApp } from "@/adapter";
import { BiochemicalReferenceDto, GetBiochemicalReferenceRequest } from "@/core/diagnostics";
import { useEffect, useState } from "react";

export function useBiochemicalReference(req?: GetBiochemicalReferenceRequest) {
    const { diagnosticServices: { biochemicalReference } } = usePediatricApp()
    const [biochemicalRefList, setBiochemicalRefList] = useState<BiochemicalReferenceDto[]>([])
    const [error, setError] = useState<string | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)

    useEffect(() => {
        const getBiochemicalRefs = async () => {
            setError(null)
            setOnLoading(true)
            const result = await biochemicalReference.get(req ? req : {})
            if ("data" in result) {
                setBiochemicalRefList(result.data)
            } else {
                console.log(JSON.parse(result.content))
                setError(JSON.parse(result.content))
            }
            setOnLoading(false)
        }
        getBiochemicalRefs()
    }, [req])

    return { data: biochemicalRefList, error, onLoading }
}