import { TREATMENT_PLAN_IDS, MilkType, MEDICINE_CODES } from "@/core/constants";
import { SystemCode, AggregateID, Result } from "@/core/shared";
import { ValueOf } from "@/utils";
import { IRecommendedTreatment } from "../models";
import { IRecommendedTreatmentService } from "../ports";

export class RecommendedTreatmentService implements IRecommendedTreatmentService {
    constructor(
      private readonly recommendedTreatmentRepo: {
        getByCode(code: SystemCode<ValueOf<typeof TREATMENT_PLAN_IDS>>): Promise<any>;
      }
    ) {}
  
    async getByTreatmentCode(
      treatmentCode: MilkType | MEDICINE_CODES
    ): Promise<Result<IRecommendedTreatment & { id: AggregateID }>> {
      try {
        // TODO: Implémenter la logique pour récupérer par treatmentCode
        // Pour l'instant, on retourne une erreur car cette méthode nécessite
        // une implémentation spécifique dans le repository
        return Result.fail("getByTreatmentCode not implemented yet");
      } catch (e: unknown) {
        return Result.fail(`Failed to get recommended treatment by treatment code: ${e}`);
      }
    }
  
    async getByRecommendationCode(
      recommendationCode: ValueOf<typeof TREATMENT_PLAN_IDS>
    ): Promise<Result<IRecommendedTreatment & { id: string }>> {
      try {
        const codeRes = SystemCode.create(recommendationCode);
        if (codeRes.isFailure) {
          return Result.fail(`Invalid recommendation code: ${codeRes.err}`);
        }
  
        const recommendedTreatment = await this.recommendedTreatmentRepo.getByCode(codeRes.val);
        return Result.ok({
          id: recommendedTreatment.getId(),
          ...recommendedTreatment.getProps(),
        });
      } catch (e: unknown) {
        return Result.fail(`Failed to get recommended treatment by recommendation code: ${e}`);
      }
    }
  }
  