// src/hooks/useDiagnosticDataForm.ts
import { useState, useEffect } from "react";
import { usePediatricApp } from "@/adapter";
import { useDispatch } from "react-redux";
import { AppDispatch, recordInteraction } from "@/src/store";
import { useToast } from "@/src/context";
import { AggregateID, DateManager, Message } from "@/core/shared";
import { PatientDto } from "@/core/patient";
import {
  AnthroSystemCodes,
  CLINICAL_SIGNS,
  OBSERVATIONS,
} from "@/core/constants";
import { PATIENT_STATE } from "@/src/constants/ui";

export function useDiagnosticDataForm(
  patientId: AggregateID,
  onClose: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const { diagnosticServices, medicalRecordService, patientService } =
    usePediatricApp();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const showGenericErrorToast = () => {
    toast.show(
      "Error",
      "Erreur technique",
      "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer dans quelques instants."
    );
  };

  const handleResetFlags = () => {
    setError(false);
    setSuccess(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (formData: Record<string, any> | null) => {
    if (!formData) return;

    setIsSubmitting(true);
    const entries = Object.entries(formData).filter(
      ([, val]) => val != undefined
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

    try {
      const patientRes = await patientService.get({ id: patientId });
      if (patientRes instanceof Message) throw new Error();

      const patientDto = patientRes.data[0] as PatientDto;
      const nutritionalDiag =
        await diagnosticServices.nutritionalDiagnostic.create({
          patientId,
          patientDiagnosticData: {
            sex: patientDto.gender,
            birthday: patientDto.birthday,
            anthropometricData: { anthropometricMeasures: [] },
            clinicalSigns: { clinicalSigns: [] },
            biologicalTestResults: [],
          },
        });
      if (!("data" in nutritionalDiag)) throw new Error();

      const medicalRes = await medicalRecordService.addData({
        medicalRecordId: patientId,
        data: {
          anthropometricData: anthroData.map(value => ({
            code: value.code,
            context: "admission",
            unit: value.unit,
            value: value.value,
            recordedAt: DateManager.formatDate(new Date()),
          })),
          biologicalData: [],
          clinicalData: [
            {
              code: CLINICAL_SIGNS.EDEMA,
              data: {
                [OBSERVATIONS.EDEMA_PRESENCE]: true,
                [OBSERVATIONS.EDEMA_GODET_COUNT]: 2,
              },
              recordedAt: DateManager.formatDate(new Date()),
            },
          ],
        },
      });
      if (!("data" in medicalRes)) throw new Error();

      setSuccess(true);
      toast.show(
        "Success",
        "Données enregistrées",
        "Données initiales enregistrées avec succès, vous pouvez effectuer un diagnostic."
      );
      dispatch(
        recordInteraction({
          patientId,
          date: new Date().toISOString(),
          state: PATIENT_STATE.NEW,
          isFirstVisitToPatientDetail: false,
        })
      );
      setTimeout(() => {
        setSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2000);
    } catch {
      setError(true);
      showGenericErrorToast();
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    success,
    handleSubmit,
    handleResetFlags,
  };
}
