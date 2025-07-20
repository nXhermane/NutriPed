import { DIAGNOSTIC_CODES } from "@/core/constants";
import { IndicatorInterpretionBadgeUiData } from "./ChartToolsData";

export const GLOBAL_DIAGNOSTIC_UI_INDICATOR = {
  [DIAGNOSTIC_CODES.MODERATE_ACUTE_MALNUTRITION]:
    IndicatorInterpretionBadgeUiData["below -2"],
  [DIAGNOSTIC_CODES.MODERATE_CHRONIC_MALNUTRITION]:
    IndicatorInterpretionBadgeUiData["below -2"],
  [DIAGNOSTIC_CODES.MODERATE_UNDERWEIGHT]:
    IndicatorInterpretionBadgeUiData["below -1"],
  [DIAGNOSTIC_CODES.OBESITY]: IndicatorInterpretionBadgeUiData["above +3"],
  [DIAGNOSTIC_CODES.OVERWEIGHT]: IndicatorInterpretionBadgeUiData["above +2"],
  [DIAGNOSTIC_CODES.SEVERE_ACUTE_MALNUTRITION]:
    IndicatorInterpretionBadgeUiData["below -4"],
  [DIAGNOSTIC_CODES.SEVERE_CHRONIC_MALNUTRITION]:
    IndicatorInterpretionBadgeUiData["below -4"],
  [DIAGNOSTIC_CODES.SEVERE_UNDERWEIGHT]:
    IndicatorInterpretionBadgeUiData["above +4"],
};
