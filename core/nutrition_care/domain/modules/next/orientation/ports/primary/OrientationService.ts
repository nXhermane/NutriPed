import {
  AnthroSystemCodes,
  APPETITE_TEST_CODES,
  CARE_PHASE_CODES,
  CLINICAL_SIGNS,
  COMPLICATION_CODES,
  DATA_POINTS,
} from "@/core/constants";
import { Result, SystemCode } from "@/core/shared";
import { ValueOf } from "@/utils";

export interface OrientationResult {
  code: SystemCode;
  treatmentPhase?: SystemCode<CARE_PHASE_CODES>;
}
export interface OrientationContext {
  [AnthroSystemCodes.WEIGHT]: number;
  [AnthroSystemCodes.MUAC]: number;
  [AnthroSystemCodes.WFLH_UNISEX]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
  [AnthroSystemCodes.WFA]: number;
  [DATA_POINTS.IS_BREASTFED]: number;
  [CLINICAL_SIGNS.EDEMA]: number;
  [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: number;
  [APPETITE_TEST_CODES.CODE]: Omit<
    ValueOf<typeof APPETITE_TEST_CODES>,
    "appetite_test_code"
  >;
}

export interface IOrientationService {
  orient(context: OrientationContext): Promise<Result<OrientationResult>>;
}
