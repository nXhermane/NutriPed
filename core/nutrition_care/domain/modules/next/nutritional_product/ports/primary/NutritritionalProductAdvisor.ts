import {
  AnthroSystemCodes,
  CARE_PHASE_CODES,
  CARE_SESSION,
  CLINICAL_SIGNS,
  MilkType,
} from "@/core/constants";

export interface NutritionalProductAdvisorContext {
  [CARE_SESSION.CURRENT_CARE_PHASE]: CARE_PHASE_CODES;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
  [AnthroSystemCodes.WEIGHT]: number;
  [CLINICAL_SIGNS.EDEMA]: number;
}

export interface INutritionalProductAdvisorService {
  suggest(context: NutritionalProductAdvisorContext): Promise<{
    code: MilkType
  }>;
}