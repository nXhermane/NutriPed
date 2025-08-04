import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/src/context/pages/patient";
import { MedicalRecordDto } from "@/core/medical_record";
import { useCallback, useEffect, useState } from "react";
import { uiBus } from "@/uiBus";

export function useMedicalRecord() {
  const { medicalRecordService } = usePediatricApp();
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDto>();
  const { patient } = usePatientDetail();
  const getMedicalRecord = useCallback(async () => {
    setOnLoading(true);
    setError(null);
    const result = await medicalRecordService.get({
      patientOrMedicalRecordId: patient.id,
    });
    if ("data" in result) {
      setMedicalRecord(result.data);
    } else {
      const _error = JSON.parse(result.content);
      console.error(_error);
      setError(_error);
    }
    setOnLoading(false);
  }, [patient, medicalRecordService]);
  useEffect(() => {
    uiBus.on("medical:update", async () => {
      await getMedicalRecord();
    });
    getMedicalRecord();
    return () => uiBus.off("medical:update", getMedicalRecord);
  }, [getMedicalRecord]);

  return { data: medicalRecord, error, onLoading };
}
