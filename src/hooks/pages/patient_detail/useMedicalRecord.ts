import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/src/context/pages/patient";
import { useQuery } from "@tanstack/react-query";

// Best practice: Define query keys in a structured way.
// This allows for easy invalidation from anywhere in the app.
export const medicalRecordKeys = {
  all: ["medicalRecords"] as const,
  detail: (patientId: string) =>
    [...medicalRecordKeys.all, "detail", patientId] as const,
};

export function useMedicalRecord() {
  const { medicalRecordService } = usePediatricApp();
  const { patient } = usePatientDetail();

  // Refactored to use useQuery from @tanstack/react-query
  return useQuery({
    queryKey: medicalRecordKeys.detail(patient.id),
    queryFn: async () => {
      const result = await medicalRecordService.get({
        patientOrMedicalRecordId: patient.id,
      });

      if ("data" in result) {
        return result.data;
      } else {
        // Let react-query handle the error state
        const errorContent = JSON.parse(result.content);
        console.error(errorContent);
        throw new Error(
          errorContent.message || "Failed to fetch medical record"
        );
      }
    },
    // Only enable the query if the patient ID exists.
    enabled: !!patient?.id,
  });
}
