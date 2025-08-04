import { MedicalRecordDto } from "@/core/medical_record";
import { useCallback, useEffect, useState } from "react";
import { AnthroSystemCodes } from "@/core/constants";
import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/src/context/pages";
import { uiBus } from "@/uiBus";
export type AnthropometricPlottedPointData = {
  xAxis: number;
  yAxis: number;
  xDate: Date;
};
export function useAnthropometricTrendsChartPointGenerator(
  dateToX: (date: Date) => number
) {
  const { patient } = usePatientDetail();
  const { medicalRecordService } = usePediatricApp();
  const [weightMeasures, setWeightMeasures] = useState<
    MedicalRecordDto["anthropometricData"]
  >([]);
  const [plottedData, setPlottedData] = useState<
    AnthropometricPlottedPointData[]
  >([]);
  const [yPlottedDomain, setYPlottedDomain] = useState<
    [min: number, max: number]
  >([0, 0]);
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const getNormalizeAnthropometricMeasure = useCallback(async () => {
    setOnLoading(true);
    const result = await medicalRecordService.getNormalizeAnthropometricData({
      patientOrMedicalRecordId: patient.id,
    });
    if ("data" in result) {
      setWeightMeasures(
        result.data.filter(anthrop => anthrop.code == AnthroSystemCodes.WEIGHT)
      );
    } else {
      const _errorContent = JSON.parse(result.content);
      console.error(_errorContent);
      setError(error);
    }
    setOnLoading(false);
  }, [patient]);
  useEffect(() => {
    uiBus.on("medical:update", async () => {
      await getNormalizeAnthropometricMeasure();
    });
    getNormalizeAnthropometricMeasure();
    return () => uiBus.off("medical:update", getNormalizeAnthropometricMeasure);
  }, [getNormalizeAnthropometricMeasure]);

  useEffect(() => {
    const processWeightMeasure = async () => {
      const _plottedData: AnthropometricPlottedPointData[] = [];
      let minValue = 0;
      let maxValue = 0;
      for (const measure of weightMeasures) {
        const xAxis = dateToX(new Date(measure.recordedAt));
        const xDate = new Date(measure.recordedAt);
        const yAxis = measure.value;
        if (yAxis < minValue) minValue = yAxis;
        if (yAxis > maxValue) maxValue = yAxis;
        _plottedData.push({ xAxis, xDate, yAxis });
      }
      setPlottedData(_plottedData);
      setYPlottedDomain([minValue, maxValue]);
    };
    processWeightMeasure();
  }, [weightMeasures, dateToX]);

  return { plottedData, yPlottedDomain, onLoading, error };
}
