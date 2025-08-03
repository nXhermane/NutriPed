import { MedicalRecordDto } from "@/core/medical_record";
import { useEffect, useState } from "react";
import { AnthroSystemCodes } from "@/core/constants";
import { usePediatricApp } from "@/adapter";
export type AnthropometricPlottedPointData = {
  xAxis: number;
  yAxis: number;
  xDate: Date;
};
export function useAnthropometricTrendsChartPointGenerator(
  dateToX: (date: Date) => number,
  medicalRecord?: MedicalRecordDto
) {
  const { unitService } = usePediatricApp();
  const defaultUnit = "kg";
  const [weightMeasures, setWeightMeasures] = useState<
    MedicalRecordDto["anthropometricData"]
  >([]);
  const [plottedData, setPlottedData] = useState<
    AnthropometricPlottedPointData[]
  >([]);

  useEffect(() => {
    if (medicalRecord) {
      setWeightMeasures(
        medicalRecord.anthropometricData.filter(
          anthrop => anthrop.code === AnthroSystemCodes.WEIGHT
        )
      );
    }
  }, [medicalRecord]);

  useEffect(() => {
    const processWeightMeasure = async () => {
      const _plottedData: AnthropometricPlottedPointData[] = [];
      for (const measure of weightMeasures) {
        const convertedValueResult = await unitService.convert({
          from: measure.unit,
          to: defaultUnit,
          value: measure.value,
        });
        if ("data" in convertedValueResult) {
          _plottedData.push({
            xAxis: dateToX(new Date(measure.recordedAt)),
            xDate: new Date(measure.recordedAt),
            yAxis: measure.value,
          });
        } else {
          const errorContent = JSON.parse(convertedValueResult.content);
          console.error(errorContent);
        }
        setPlottedData(_plottedData);
      }
    };
    processWeightMeasure();
  }, [weightMeasures, dateToX]);

  return { plottedData };
}
