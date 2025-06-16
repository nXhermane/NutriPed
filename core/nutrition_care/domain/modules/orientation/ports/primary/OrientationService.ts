import { Result, SystemCode } from "@shared";
import {
  CLINICAL_SIGNS,
  AnthroSystemCodes,
  COMPLICATION_CODES,
  TREATMENT_HISTORY_VARIABLES_CODES,
  ORIENTATION_REF_CODES,
} from "../../../../../../constants";
import {
  APPETITE_TEST_CODES,
  APPETITE_TEST_RESULT_CODES,
} from "../../../appetiteTest";
import { OrientationReference } from "../../models";

export interface OrientationContext {
  [CLINICAL_SIGNS.EDEMA]: number;
  [AnthroSystemCodes.WFLH_UNISEX]: number;
  [AnthroSystemCodes.WFH_UNISEX_NCHS]: number;
  [AnthroSystemCodes.MUAC]: number;
  [APPETITE_TEST_CODES.CODE]: APPETITE_TEST_RESULT_CODES;
  [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
  [AnthroSystemCodes.WEIGHT]: number;
  [AnthroSystemCodes.WFA]: number;
  [TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT]:
    | "ORIENTATION_HOME"
    | "ORIENTATION_CRENAM"
    | "ORIENTATION_CNT"
    | "ORIENTATION_CNA";
}

export interface OrientationResult {
  name: string;
  code: SystemCode;
}

export interface IOrientationService {
  orient(
    orientationContext: OrientationContext,
    orientationRefs: OrientationReference[]
  ): Result<OrientationResult>;
}
