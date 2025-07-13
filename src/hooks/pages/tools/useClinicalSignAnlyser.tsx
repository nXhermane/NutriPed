import { usePediatricApp } from "@/adapter";
import { useMemo } from "react";
import { VariableUsageMap } from "./useClinicalSignReferenceDataCombinator";

export function useClinicalSignAnalyser() {
  const {
    diagnosticServices: { clinicalNutritionalAnalysis },
  } = usePediatricApp();

  const submit = useMemo(
    () =>
      (
        data: { [dataCode: string]: any },
        variableUsageMap: VariableUsageMap
      ) => {
        const submitData: {
          [signCode: string]: { code: string; data: object };
        } = {};
        for (const [dataCode, clinicalSignCodes] of Object.entries(
          variableUsageMap
        )) {
          for (const signCode of clinicalSignCodes) {
            if (!submitData[signCode]) {
              submitData[signCode] = {
                code: signCode,
                data: { [dataCode]: data[dataCode] },
              };
            } else {
              submitData[signCode].data = {
                ...submitData[signCode].data,
                [dataCode]: data[dataCode],
              };
            }
          }
        }
      },
    [clinicalNutritionalAnalysis]
  );

  return submit;
}
