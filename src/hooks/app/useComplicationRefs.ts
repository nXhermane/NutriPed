import { usePediatricApp } from "@/adapter";
import { ClinicalSignReferenceDto } from "@/core/evaluation";
import { ComplicationDto, GetComplicationRequest } from "@/core/nutrition_care";
import { useEffect, useState } from "react";

export function useComplicationRefs(req?: GetComplicationRequest) {
  const {
    nutritionCareServices: { complication },
  } = usePediatricApp();
  const [complicationRefList, setComplicationRefList] = useState<
    ComplicationDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  useEffect(() => {
    const getClinicalSignRefs = async () => {
      setError(null);
      setOnLoading(true);
      const result = await complication.get(req ? req : {});
      if ("data" in result) setComplicationRefList(result.data);
      else {
        console.error(JSON.parse(result.content));
        setError(JSON.parse(result.content));
      }
      setOnLoading(false);
    };
    getClinicalSignRefs();
  }, [req]);
  return { data: complicationRefList, onLoading, error };
}
