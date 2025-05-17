import { Result } from "@shared";
import { BiologicalTestResult } from "../../../models";
import { ValidateResult } from "../../../../common";

export interface IBiologicalValidationService {
   validate(data: BiologicalTestResult[]): Promise<Result<ValidateResult>>;
}
