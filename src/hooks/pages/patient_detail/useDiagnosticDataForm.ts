import { useRef, useState } from "react";
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
  const isSubmit = useRef<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { diagnosticServices, medicalRecordService, patientService } =
    usePediatricApp();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const showGenericErrorToast = (e: string) => {
    toast.show(
      "Error",
      "Erreur d'enregistrement",
      `Impossible d'enregistrer les données.  Vérifiez si les données entrées sont correctes et réessayez.${e}`
    );
  };

  const handleResetFlags = () => {
    setError(false);
    setSuccess(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (formData: Record<string, any> | null) => {
    if (isSubmit.current || isSubmitting) return;
    handleResetFlags();
    if (!formData) return;

    setIsSubmitting(true);
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

    try {
      // Recuperer le patient
      const patientRes = await patientService.get({ id: patientId });
      if (patientRes instanceof Message)
        throw new Error(JSON.parse(patientRes.content));

      const patientDto = patientRes.data[0] as PatientDto;
      // Create a NutritionalDiagnostic Object of patient
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
      if (nutritionalDiag instanceof Message)
        throw new Error(JSON.parse(nutritionalDiag.content));
      // If succeed, add data to medical record
      const medicalRes = await medicalRecordService.addData({
        medicalRecordId: patientId,
        data: {
          anthropometricData: anthroData.map(value => ({
            code: value.code,
            context: "admission",
            unit: value.unit,
            value: value.value,
          })),
          biologicalData: [],
          clinicalData: [
            {
              code: CLINICAL_SIGNS.EDEMA,
              data: {
                [OBSERVATIONS.EDEMA_PRESENCE]:
                  (formData as any)["clinical_edema"] === "no" ? false : true,
              },
            },
          ],
        },
      });
      if (medicalRes instanceof Message)
        throw new Error(JSON.parse(medicalRes.content));
      isSubmit.current = true;
      setSuccess(true);
      toast.show(
        "Success",
        "Données enregistrées",
        "Les données initiales ont été sauvegardées avec succès. Vous pouvez maintenant procéder au diagnostic nutritionnel."
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
      }, 0);
    } catch (e: any) {
      console.error(e);
      setError(true);
      showGenericErrorToast(e.message);
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit: isSubmitting,
    error,
    onSucess: success,
    handleSubmit,
    handleResetFlags,
  };
}
