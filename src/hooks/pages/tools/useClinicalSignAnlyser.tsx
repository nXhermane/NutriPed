import { usePediatricApp } from "@/adapter";
import { useMemo } from "react";
import { VariableUsageMap } from "./useClinicalSignReferenceDataCombinator";
import { AnthroSystemCodes } from "@/core/constants";

export function useClinicalSignAnalyser() {
  const {
    diagnosticServices: { clinicalNutritionalAnalysis },
  } = usePediatricApp();

  const submit = useMemo(
    () =>
      async (
        data: { [dataCode: string]: any },
        variableUsageMap: VariableUsageMap
      ) => {
        try {
          const evaluationContext = {
            [AnthroSystemCodes.AGE_IN_DAY]: data[AnthroSystemCodes.AGE_IN_DAY],
            [AnthroSystemCodes.AGE_IN_MONTH]:
              data[AnthroSystemCodes.AGE_IN_MONTH],
            [AnthroSystemCodes.SEX]: data[AnthroSystemCodes.SEX],
          };
          return clinicalNutritionalAnalysis.makeClinicalAnalysis({
            ...evaluationContext,
            clinicalSigns: remapSignDataToClinicalSign(data, variableUsageMap),
          });
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    [clinicalNutritionalAnalysis]
  );

  return submit;
}

export function remapSignDataToClinicalSign(
  data: { [dataCode: string]: any },
  variableUsageMap: VariableUsageMap
) {
  const clinicalSigns: {
    [signCode: string]: { code: string; data: { [Key: string]: any } };
  } = {};
  for (const dataCode in variableUsageMap) {
    const signCodes = variableUsageMap[dataCode];
    for (const signCode of signCodes) {
      if (!clinicalSigns[signCode]) {
        clinicalSigns[signCode] = {
          code: signCode,
          data: { [dataCode]: data[dataCode] },
        };
      } else {
        clinicalSigns[signCode].data[dataCode] = data[dataCode];
      }
    }
  }
  return Object.values(clinicalSigns);
}
