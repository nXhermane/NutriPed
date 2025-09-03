import { Result } from "@/core/shared";
import { CarePlanRecommendation, CarePlanAjustement } from "../../../modules";
import { CarePhase } from "../models";
import { ICarePlanApplicatorService } from "./interfaces";

/**
 * C'est ici que la logique principale de management du care phase sera implementer. 
 */
export class CarePlanApplicatorService implements ICarePlanApplicatorService {
    applyPlan(recommendation: CarePlanRecommendation, targetCarePhase: CarePhase): Result<void> {
        throw new Error("Method not implemented.");
    }
    applyAjustments(ajustement: CarePlanAjustement, targetCarePhase: CarePhase): Result<void> {
        throw new Error("Method not implemented.");
    }

}
