import { Result, SystemCode } from "@/core/shared";

export interface IComputedVariablePerformerACL {
  computeVariables(
    computedVariableCodes: SystemCode<string>[],
    context: Record<string, number>
  ): Promise<Result<Record<string, number>>>;
}
