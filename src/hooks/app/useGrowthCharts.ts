import { usePediatricApp } from "@/adapter";
import {
  GetGrowthReferenceChartRequest,
  GrowthReferenceChartDto,
} from "@/core/evaluation";
import { useEffect, useMemo, useState } from "react";

export function useGrowthCharts(request?: GetGrowthReferenceChartRequest) {
  const {
    diagnosticServices: { growthChart },
  } = usePediatricApp();
  const [growthChartList, setGrowthChartList] = useState<
    GrowthReferenceChartDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  useEffect(() => {
    const getGrowthCharts = async () => {
      setError(null);
      setOnLoading(true);
      const result = await growthChart.get(request ? request : {});
      if ("data" in result) {
        setGrowthChartList(result.data);
      } else {
        console.error(result.content);
        setError(result.content);
      }
      setOnLoading(false);
    };
    getGrowthCharts();
  }, [request]);
  return { data: growthChartList, onLoading, error };
}
