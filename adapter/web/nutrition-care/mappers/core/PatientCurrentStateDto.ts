import { APPETITE_TEST_RESULT_CODES, ValueTypeDto } from "@core/nutrition_care";
import { ConditionResult } from "@shared";
import { EntityPersistenceDto } from "../../../common";

export interface PatientCurrentStatePersistenceDto extends EntityPersistenceDto {
   anthropometricData: { [key: string]: ValueTypeDto<number> };
   clinicalSignData: { [key: string]: ValueTypeDto<(typeof ConditionResult)[keyof typeof ConditionResult]> };
   biologicalData: { [key: string]: ValueTypeDto<number> };
   appetiteTestResult: { [key: string]: ValueTypeDto<APPETITE_TEST_RESULT_CODES> };
   complicationData: { [key: string]: ValueTypeDto<(typeof ConditionResult)[keyof typeof ConditionResult]> };
}
