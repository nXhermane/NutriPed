import { Result } from "@/core/shared";

export interface IComputedVariablePerformer {
    computeVariables(context: Record<string, number>): Promise<Result<Record<string, number>>>;
}