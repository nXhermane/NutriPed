import { AggregateID, Result } from "@/core/shared";
import { IClinicalSignDataInterpretationACL } from "../../domain";
import { IMakeClinicalSignDataInterpretationService } from "@/core/diagnostics";

export class ClinicalSignDataInterpretationACL
  implements IClinicalSignDataInterpretationACL
{
  constructor(
    private readonly makeClinicalInterpretationService: IMakeClinicalSignDataInterpretationService
  ) {}
  async analyze(
    patientId: AggregateID,
    clinicalSignData: { code: string; data: object }[]
  ): Promise<Result<{ code: string; isPresent: boolean }[]>> {
    const request = {
      patientId,
      signs: clinicalSignData,
    };
    const result =
      await this.makeClinicalInterpretationService.interpret(request);
    if ("data" in result) {
      return Result.ok(result.data);
    } else {
      const _errorContent = JSON.parse(result.content);
      return Result.fail(_errorContent);
    }
  }
}
