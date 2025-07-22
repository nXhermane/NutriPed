import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/components/pages/patient_detail/context";
import { MedicalRecordDto } from "@/core/medical_record";
import { useEffect, useState } from "react";

export function useMedicalRecord() {
  const { medicalRecordService } = usePediatricApp();
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDto>();
  const { patient } = usePatientDetail();
  useEffect(() => {
    const getMedicalRecord = async () => {
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
    };

    getMedicalRecord();
  }, [patient]);

  return { data: medicalRecord, error, onLoading };
}
