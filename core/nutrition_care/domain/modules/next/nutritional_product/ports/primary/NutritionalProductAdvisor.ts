import {
  AnthroSystemCodes,
  CARE_PHASE_CODES,
  CARE_SESSION,
  CLINICAL_SIGNS,
  AdmissionVariable,
  NUTRITIONAL_PRODUCT_CODE,
} from "@/core/constants";
import { NutritionalProductDosage } from "../../models";
import { Result, SystemCode } from "@/core/shared";

export type NutritionalProductAdvisorContext = {
  [CARE_SESSION.CURRENT_CARE_PHASE]: CARE_PHASE_CODES;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
  [AnthroSystemCodes.WEIGHT]: number;
  [CLINICAL_SIGNS.EDEMA]: number;
} & {
  [K in AdmissionVariable<typeof CLINICAL_SIGNS.EDEMA>]: number;
} & {
  [K in AdmissionVariable<AnthroSystemCodes.WEIGHT>]: number;
};

export interface INutritionalProductAdvisorService {
  /**
   * Cas 1 : Lait inconnu, le service choisit le produit approprié
   */
  evaluate(
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage?: number
  ): Promise<Result<NutritionalProductDosage>>;

  /**
   * Cas 2 : Lait déjà connu, le service calcule seulement le dosage
   */
  getDosage(
    productCode: SystemCode<NUTRITIONAL_PRODUCT_CODE>,
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage?: number // par défaut 100 %
  ): Promise<Result<NutritionalProductDosage>>;
}
