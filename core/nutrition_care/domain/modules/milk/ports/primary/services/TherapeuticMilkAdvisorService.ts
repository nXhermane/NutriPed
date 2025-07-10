import { Result } from "@shared";
import {
  AnthroSystemCodes,
  CLINICAL_SIGNS,
  COMPLICATION_CODES,
} from "../../../../../../../constants";
import {
  APPETITE_TEST_CODES,
  APPETITE_TEST_RESULT_CODES,
} from "../../../../appetiteTest";
import { Milk, MilkSuggestionResult } from "../../../models";

export type MilkSuggestionInput = {
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
  [AnthroSystemCodes.WEIGHT]: number;
  [APPETITE_TEST_CODES.CODE]: APPETITE_TEST_RESULT_CODES;
  [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: number;
  [CLINICAL_SIGNS.EDEMA]: number;
};

export interface ITherapeuticMilkAdvisorService {
  suggest(
    input: MilkSuggestionInput,
    milks: Milk[]
  ): Result<MilkSuggestionResult>;
}
