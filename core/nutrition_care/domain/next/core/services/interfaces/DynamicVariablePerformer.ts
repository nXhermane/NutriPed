import { Result } from "@/core/shared";

export interface IDynamicVariablePerformer {
  generateVariable(
    context: Record<string, number>
  ): Promise<Result<Record<string, number>>>;
}

/**
 * C'est ce service qui va s'occuper de la generation des variables dynamique;
 */
