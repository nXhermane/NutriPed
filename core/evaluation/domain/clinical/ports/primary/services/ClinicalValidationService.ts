import { Result } from "@shared";
import { ClinicalData } from "../../../models";
import { ValidateResult } from "../../../../common";

export interface IClinicalValidationService {
  validate(clinicalData: ClinicalData): Promise<Result<ValidateResult>>;
}
