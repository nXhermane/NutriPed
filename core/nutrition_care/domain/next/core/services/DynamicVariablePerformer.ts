import { Result } from "@/core/shared";
import { IDynamicVariablePerformer } from "./interfaces";

export class DynamicVariablePerformerService
  implements IDynamicVariablePerformer
{
  generateVariable(
  ): Promise<Result<Record<string, number>>> {
    throw new Error("Method not implemented.");
  }
}
