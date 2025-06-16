import { AggregateID, ConditionResult } from "@shared";
import { APPETITE_TEST_RESULT_CODES } from "../../../domain";
import { TREATMENT_HISTORY_VARIABLES_CODES } from "../.././../../constants";

export interface ValueTypeDto<T> {
  value: T;
  code: string;
  date: string;
}
export interface PatientCurrentStateDto {
  id: AggregateID;
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
  otherData: {
    [TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT]:
      | "ORIENTATION_HOME"
      | "ORIENTATION_CRENAM"
      | "ORIENTATION_CNT"
      | "ORIENTATION_CNA";
  };
  createdAt: string;
  updatedAt: string;
}
