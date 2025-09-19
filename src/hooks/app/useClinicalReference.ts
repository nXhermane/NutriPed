import { usePediatricApp } from "@/adapter";
import {
  ClinicalSignReferenceDto,
  GetClinicalSignReferenceRequest,
} from "@/core/evaluation";
import { useEffect, useState } from "react";

export function useClinicalReference(req?: GetClinicalSignReferenceRequest) {
  const {
    diagnosticServices: { clinicalSign },
  } = usePediatricApp();
  const [clinicalSignRefList, setClinicalSignRefList] = useState<
    ClinicalSignReferenceDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  useEffect(() => {
    const getClinicalSignRefs = async () => {
      setError(null);
      setOnLoading(true);
      const result = await clinicalSign.get(req ? req : {});
      if ("data" in result) setClinicalSignRefList(result.data);
      else {
        console.error(JSON.parse(result.content));
        setError(JSON.parse(result.content));
      }
      setOnLoading(false);
    };
    getClinicalSignRefs();
  }, [req]);
  return { data: clinicalSignRefList, onLoading, error };
}
