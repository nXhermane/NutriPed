import { ValueTypeDto, APPETITE_TEST_RESULT_CODES } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../../shared";
import { ConditionResult } from "@core/constants";

export interface PatientCurrentStatePersistenceDto
  extends EntityPersistenceDto {
  anthropometricData: { [key: string]: ValueTypeDto<number> };
  clinicalSignData: {
    [key: string]: ValueTypeDto<
      (typeof ConditionResult)[keyof typeof ConditionResult]
    >;
  };
  biologicalData: { [key: string]: ValueTypeDto<number> };
  appetiteTestResult: {
    [key: string]: ValueTypeDto<APPETITE_TEST_RESULT_CODES>;
  };
  complicationData: {
    [key: string]: ValueTypeDto<
      (typeof ConditionResult)[keyof typeof ConditionResult]
    >;
  };
}
