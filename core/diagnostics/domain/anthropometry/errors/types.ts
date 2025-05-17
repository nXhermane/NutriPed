import { GROWTH_INDICATOR_ERRORS } from "./messages";

export type GrowthIndicatorErrorCode = keyof typeof GROWTH_INDICATOR_ERRORS;

export interface DomainError {
   code: string;
   message: string;
   domain: string;
   details?: string;
}

export interface GrowthIndicatorError extends DomainError {
   domain: "GrowthIndicator";
   code: GrowthIndicatorErrorCode;
}
