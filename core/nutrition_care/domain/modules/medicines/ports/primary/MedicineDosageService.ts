import { Result } from "@shared";
import { Medicine, MedicineDosageResult } from "../../models";
import { AnthroSystemCodes } from "../../../../../../constants";

export interface IMedicineDosageService {
   generateDosage(medicine: Medicine, context: { [AnthroSystemCodes.WEIGHT]: number }): Result<MedicineDosageResult>;
}
