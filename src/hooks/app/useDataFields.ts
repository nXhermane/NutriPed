import { usePediatricApp } from "@/adapter";
import { DataFieldReferenceDto, GetDataFieldRefRequest } from "@/core/evaluation";
import { useCallback, useEffect, useState } from "react";

export function useDataFields(req?: GetDataFieldRefRequest) {
    const { diagnosticServices: { dataFields: dataFieldService } } = usePediatricApp();
    const [dataFields, setDataFields] = useState<DataFieldReferenceDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [onLoading, setOnLoading] = useState<boolean>(false);

    const loadDataFields = useCallback(async () => {
        setError(null);
        setOnLoading(true);
        const result = await dataFieldService.get(req ? req : {});
        if ("data" in result) {
            setDataFields(result.data);
        }
        else {
            const _errorContent = JSON.parse(result.content);
            setError(_errorContent);
        }
        setOnLoading(false);
    }, [dataFieldService, req])

    useEffect(() => {
        loadDataFields();
    }, [dataFieldService, req])
    return { data: dataFields, error, onLoading, reload: loadDataFields };
} 