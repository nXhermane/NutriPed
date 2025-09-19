import { usePediatricApp } from "@/adapter";
import {
  GLOBAL_DIAGNOSTIC_UI_INDICATOR,
  PATIENT_STATE,
} from "@/src/constants/ui";
import { usePatientDetail } from "@/src/context/pages";
import { Interaction, recordInteraction } from "@/src/store";
import { uiBus } from "@/uiBus";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useGenerateNutritionalDiagnostic() {
  const {
    diagnosticServices: { nutritionalDiagnostic },
  } = usePediatricApp();
  const { patient } = usePatientDetail();
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const patientInteractionLists: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );
  const dispatch = useDispatch();
  const generate = useCallback(async () => {
    setError(null);
    setOnLoading(true);
    setIsSuccess(false);
    const result = await nutritionalDiagnostic.generateDiagnosticResult({
      nutritionalDiagnosticId: patient.id,
    });
    if ("data" in result) {
      setIsSuccess(true);
      uiBus.emit("nutritional:diagnostic:update");
      const findedIndex = patientInteractionLists.findIndex(
        interact => interact.patientId === patient.id
      );
      if (findedIndex != -1) {
        const interaction = patientInteractionLists[findedIndex];
        const isAttention = result.data.globalDiagnostics.some(diagnostic =>
          ["Sévère", "Modérée"].includes(
            GLOBAL_DIAGNOSTIC_UI_INDICATOR[
              diagnostic.code as keyof typeof GLOBAL_DIAGNOSTIC_UI_INDICATOR
            ].label
          )
        );
        const isNormal =
          (result.data.globalDiagnostics.length == 0 &&
            result.data.growthIndicatorValues.length != 0) ||
          result.data.globalDiagnostics.every(diagnostic =>
            ["Normal", "Risque"].includes(
              GLOBAL_DIAGNOSTIC_UI_INDICATOR[
                diagnostic.code as keyof typeof GLOBAL_DIAGNOSTIC_UI_INDICATOR
              ].label
            )
          );
        if (isAttention || isNormal) {
          dispatch(
            recordInteraction({
              ...interaction,
              state: isAttention
                ? PATIENT_STATE.ATTENTION
                : isNormal
                  ? PATIENT_STATE.NORMAL
                  : PATIENT_STATE.NEW,
            })
          );
        }
      }
    } else {
      const _errorContent = JSON.parse(result.content);
      console.error(_errorContent);
      setError(_errorContent);
    }
    setOnLoading(false);
  }, [patient, nutritionalDiagnostic, patientInteractionLists, dispatch]);
  return { generate, error, onLoading, isSuccess };
}
