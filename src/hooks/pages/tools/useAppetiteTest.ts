import { usePediatricApp } from "@/adapter";
import {
  AppetiteTestResultDto,
  EvaluateAppetiteRequest,
} from "@/core/nutrition_care";
import { Message } from "@/core/shared";
import { useCallback, useState } from "react";

export function useAppetiteTest() {
  const { nutritionCareServices } = usePediatricApp();
  const [error, setError] = useState<string | null>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [result, setResult] = useState<AppetiteTestResultDto | null>(null);
  const submit = useCallback(
    async (appetiteTestRequest: EvaluateAppetiteRequest) => {
      setOnSubmit(true);
      setError(null);
      setResult(null);
      const result =
        await nutritionCareServices.appetiteTest.evaluateAppetite(
          appetiteTestRequest
        );
      if (result instanceof Message) {
        console.error(result);
        setError(result.content);
      } else {
        setResult(result.data);
      }
      setOnSubmit(false);
    },
    [nutritionCareServices.appetiteTest]
  );

  return { submit, result, onSubmit, error };
}
