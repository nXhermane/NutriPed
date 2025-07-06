import { usePediatricApp } from "@/adapter";
import { GetMilkRequest, MilkDto } from "@/core/nutrition_care";
import { useEffect, useState } from "react";

export function useMilks(req?: GetMilkRequest) {
  const {
    nutritionCareServices: { milk },
  } = usePediatricApp();
  const [milkList, setMilkList] = useState<MilkDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMilks = async () => {
      setError(null);
      setOnLoading(true);
      const result = await milk.get(req ? req : {});
      if ("data" in result) {
        setMilkList(result.data);
      } else {
        setError(result.content);
      }
      setOnLoading(false);
    };
    getMilks();
  }, [req, milk]);
  return { data: milkList, onLoading, error };
}
