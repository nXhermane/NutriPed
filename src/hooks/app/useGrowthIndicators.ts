import { usePediatricApp } from "@/adapter";
import { GetIndicatorRequest, IndicatorDto } from "@/core/diagnostics";
import { useEffect, useState } from "react";

export function useGrowthIndicators(request?: GetIndicatorRequest) {
  const {
    diagnosticServices: { indicator },
  } = usePediatricApp();
  const [indicatorList, setIndicatorList] = useState<IndicatorDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);

  useEffect(() => {
    const getIndicators = async () => {
      setError(null);
      setOnLoading(true);
      const result = await indicator.get(request || {});
      if ("data" in result) setIndicatorList(result.data);
      else {
        console.error(result.content);
        setError(result.content);
      }
      setOnLoading(false);
    };
    getIndicators();
  }, [request]);
  return { error, onLoading, data: indicatorList };
}
