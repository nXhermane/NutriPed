import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/components/pages/patient_detail/context";
import { DailyCareJournalDto } from "@/core/nutrition_care";
import { useEffect, useState } from "react";

export function useDailyCareJournals() {
  const {
    nutritionCareServices: { patientCareSession },
  } = usePediatricApp();
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [dailyJournals, setDailyJournals] = useState<{
    current?: DailyCareJournalDto;
    previeous: DailyCareJournalDto[];
  }>({ previeous: [], current: undefined });
  const { patient } = usePatientDetail();
  useEffect(() => {
    if (!patient) return;
    const getDailyJournals = async () => {
      setError(null);
      setOnLoading(true);
      const result = await patientCareSession.getDailyJournals({
        patientIdOrSessionId: patient.id,
      });
      if ("data" in result) {
        setDailyJournals(result.data);
      } else {
        const _error = JSON.parse(result.content);
        console.error(_error);
        setError(_error);
      }
      setOnLoading(false);
    };
    getDailyJournals();
  }, [patient, patientCareSession]);

  return { data: dailyJournals, onLoading, error };
}
