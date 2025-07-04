import { usePediatricApp } from "@/adapter";
import { Sex } from "@/core/shared";
import { ChartMeasurement } from "@/src/store";
import { useCallback } from "react";

export function useGrowthIndicatorValueGeneratorForTable(
  indicatorCode: string
) {
  const {
    diagnosticServices: { growthIndicatorValue },
  } = usePediatricApp();
  const submit = useCallback(
    async (data: ChartMeasurement["data"]) => {
      const result = await growthIndicatorValue.calculateIndicator({
        anthropometricData: {
          anthropometricMeasures: Object.values(data).filter(
            value => typeof value != "number" && value.code != "lenhei"
          ),
        },
        age_in_day: (data["age_in_day"] as number) || 0,
        age_in_month: (data["age_in_month"] as number) || 0,
        indicatorCode: indicatorCode,
        sex: Sex.MALE,
      });
      if ("data" in result) {
        return result.data;
      } else {
        console.error(result.content);
        return null;
      }
    },
    [indicatorCode]
  );

  return { submit };
}
