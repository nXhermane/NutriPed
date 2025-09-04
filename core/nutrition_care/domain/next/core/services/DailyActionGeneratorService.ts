import { handleError, Result } from "@/core/shared";
import { OnGoingTreatment, DailyCareAction } from "../models";
import { IDailyActionGeneratorService } from "./interfaces";

export class DailyActionGeneratorService implements IDailyActionGeneratorService {
    
   async generate(treatment: OnGoingTreatment, context: Record<string, number>): Promise<Result<DailyCareAction>> {
        try {

        } catch (e: unknown) {
            return handleError(e);
        }
    }

}