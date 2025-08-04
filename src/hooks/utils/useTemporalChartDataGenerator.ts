import { DateAxis } from "@/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TemporalChartPoint = {
  x: number;
  xValue: Date;
  y: number;
};

export function useTemporalChartDataGenerator(
  range: { start: Date; end?: Date },
  gap: number = 0
) {
  const [data, setData] = useState<TemporalChartPoint[]>([]);
  const dateAxisInstance = useMemo<DateAxis>(
    () => new DateAxis(range.start),
    [range.start]
  );
  const dateToX = useCallback(
    (date: Date) => dateAxisInstance.dateToX(date),
    [dateAxisInstance]
  );
  const xToDate = useCallback(
    (x: number) => dateAxisInstance.xToDate(x),
    [dateAxisInstance]
  );
  useEffect(() => {
    let currentY = 0;
    setData(
      dateAxisInstance
        .generateDateRange(range.end ? range.end : new Date(), gap + 1)
        .map(value => {
          if (currentY === 0) {
            currentY = 10;
          } else {
            currentY = 0;
          }
          return {
            x: value.x,
            xValue: value.date,
            y: currentY,
          };
        })
    );
  }, [range, gap, dateAxisInstance]);

  return { data, dateToX, xToDate };
}
