import { usePediatricApp } from "@/adapter";
import {
  DiagnosticRuleDto,
  GetDiagnosticRuleRequest,
} from "@/core/diagnostics";
import { useEffect, useState } from "react";

export function useDiagnosticRules(request?: GetDiagnosticRuleRequest) {
  const {
    diagnosticServices: { diagnosticRule },
  } = usePediatricApp();
  const [diagnosticRules, setDiagnosticRules] = useState<DiagnosticRuleDto[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState<boolean>(false);

  useEffect(() => {
    const getDiagnosticRules = async () => {
      setError(null);
      setOnLoading(true);
      const result = await diagnosticRule.get(request ? request : {});
      if ("data" in result) {
        setDiagnosticRules(result.data);
      } else {
        console.error(result.content);
        setError(result.content);
      }
      setOnLoading(false);
    };
    getDiagnosticRules();
  }, [request]);
  return { data: diagnosticRules, onLoading, error };
}
