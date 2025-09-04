import { Result } from "@/core/shared";
import { DailyCareAction, OnGoingTreatment } from "../../models";

export interface IDailyActionGeneratorService {
  generate(
    treatment: OnGoingTreatment,
    context: Record<string, number>
  ): Promise<Result<DailyCareAction>>;
}
