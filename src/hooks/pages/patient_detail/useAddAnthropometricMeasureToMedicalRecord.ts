import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/src/context/pages/patient";
import { AnthroSystemCodes } from "@/core/constants";
import { DateManager } from "@/core/shared";
import { useCallback, useState } from "react";
import { uiBus } from "@/uiBus";

export function useAddAnthropometricMeasureToMedicalRecord() {
  const { patient } = usePatientDetail();
  const { medicalRecordService } = usePediatricApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useCallback(
    async (formData: Record<string, any> | null | undefined) => {
      if (!formData) return;
      setIsSubmitting(true);
      setIsSuccess(false);
      setError(null);
      setIsSubmitting(false);
      const entries = Object.entries(formData).filter(
        ([, val]) => val !== undefined
      );
      const anthroData = entries
        .filter(([key]) =>
          [
            AnthroSystemCodes.WEIGHT,
            AnthroSystemCodes.LENGTH,
            AnthroSystemCodes.HEIGHT,
            AnthroSystemCodes.HEAD_CIRCUMFERENCE,
            AnthroSystemCodes.SSF,
            AnthroSystemCodes.MUAC,
            AnthroSystemCodes.TSF,
          ].includes(key as AnthroSystemCodes)
        )
        .map(([, val]) => val);

      const result = await medicalRecordService.addData({
        medicalRecordId: patient.id,
        data: {
          anthropometricData: anthroData.map(value => ({
            code: value.code,
            context: "follow_up",
            unit: value.unit,
            value: value.value,
          })),
        },
      });
      if ("data" in result) {
        setIsSuccess(true);
        uiBus.emit("medical:update");
      } else {
        const _errorContent = JSON.parse(result.content);
        console.error(_errorContent);
        setError(_errorContent);
      }
      setIsSubmitting(false);
    },
    []
  );

  return {
    submit,
    error,
    isSuccess,
    isSubmitting,
  };
}
