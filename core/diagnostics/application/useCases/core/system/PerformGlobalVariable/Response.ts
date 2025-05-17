import { Either, ExceptionBase, Result, Sex } from "@shared";
import { AnthroSystemCodes, BIOCHEMICAL_REF_CODES, CLINICAL_SIGNS, ConditionResult } from "../../../../../../constants";

export type PatientGlobalVariables = {
   anthropometricVariableObjects: Record<AnthroSystemCodes, number | Sex | undefined>;
   clinicalVariablesObjects: Record<(typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS], (typeof ConditionResult)[keyof typeof ConditionResult]>;
   biologicalVariablesObjects: Record<(typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES], number>;
};
export type PerformPatientGlobalVariableResponse = Either<ExceptionBase | unknown, Result<PatientGlobalVariables>>;
