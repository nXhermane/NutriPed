// /**
//  * @enum GrowthStandard
//  * Définit les standards de référence pour la croissance des enfants.
//  * @property OMS - Organisation Mondiale de la Santé (WHO)
//  * @property NCHS - National Center for Health Statistics
//  * @property CDC - Centers for Disease Control and Prevention
//  */
// export enum GrowthStandard {
//    OMS = "oms",
//    NCHS = "nchs",
//    CDC = "cdc",
// }

// /**
//  * @enum StandardShape
//  * Définit la forme des standards de référence utilisés.
//  * @property TABLE - Standards basés sur des tableaux de données.
//  * @property CURVE - Standards basés sur des courbes de croissance.
//  */
// export enum StandardShape {
//    TABLE = "growth_table",
//    CURVE = "growth_curve",
// }

// /**
//  * @enum GrowthIndicatorRange
//  * Représente les différentes plages des indicateurs de croissance en écarts-types (Z-scores).
//  * @property ABOVE_4 - Au-dessus de +4 écarts-types.
//  * @property ABOVE_3 - Au-dessus de +3 écarts-types.
//  * @property ABOVE_2 - Au-dessus de +2 écarts-types.
//  * @property ABOVE_1 - Au-dessus de +1 écart-type.
//  * @property MEDIAN - Médiane (0 écart-type).
//  * @property BELOW_M1 - En dessous de -1 écart-type.
//  * @property BELOW_M2 - En dessous de -2 écarts-types.
//  * @property BELOW_M3 - En dessous de -3 écarts-types.
//  * @property BELOW_M4 - En dessous de -4 écarts-types.
//  */
// export enum GrowthIndicatorRange {
//    ABOVE_4 = "above +4",
//    ABOVE_3 = "above +3",
//    ABOVE_2 = "above +2",
//    ABOVE_1 = "above +1",
//    MEDIAN = "0",
//    BELOW_M1 = "below -1",
//    BELOW_M2 = "below -2",
//    BELOW_M3 = "below -3",
//    BELOW_M4 = "below -4",
// }

// /**
//  * Nombre moyen de jours dans un mois (approximé à 30.4375 jours).
//  * @constant
//  */
// export const DAY_IN_MONTHS = 30.4375;

// /**
//  * Nombre moyen de jours dans une année (incluant les années bissextiles).
//  * @constant
//  */
// export const DAY_IN_YEARS = 365.25;

// /**
//  * Nombre de mois dans une année.
//  * @constant
//  */
// export const MONTH_IN_YEARS = 12;

// /**
//  * Âge maximal en pédiatrie (19 ans).
//  * @constant
//  */
// export const MAX_AGE_IN_PEDIATRIC = 19;
// export const MAX_AGE_IN_DAY_TO_USE_AGE_IN_DAY = 1856;
// export const MAX_AGE_MONTH_TO_USE_AGE_IN_DAY = MAX_AGE_IN_DAY_TO_USE_AGE_IN_DAY / DAY_IN_MONTHS;

// /**
//  * @enum AnthroSystemCodes
//  * Définit les codes des mesures anthropométriques utilisées en pédiatrie.
//  * @property HEIGHT - Taille mesurée en position debout.
//  * @property LENGTH - Longueur mesurée en position couchée.
//  * @property LENHEI - Taille/longueur uniforme pour standardisation.
//  * @property WEIGHT - Poids du patient.
//  * @property BMI - Indice de Masse Corporelle (IMC).
//  * @property HEAD_CIRCUMFERENCE - Périmètre crânien.
//  * @property MUAC - Périmètre brachial (Mid-Upper Arm Circumference).
//  * @property TSF - Pli cutané tricipital (Triceps Skinfold Thickness).
//  * @property SSF - Pli cutané sous-scapulaire (Subscapular Skinfold Thickness).
//  * @property WFLH - Poids pour la longueur/taille (Weight-for-Length/Height).
//  * @property WFA - Poids pour l'âge (Weight-for-Age).
//  * @property HFA - Taille pour l'âge (Height-for-Age).
//  * @property BMI_FOR_AGE - IMC pour l'âge (BMI-for-Age).
//  * @property MUAC_FOR_AGE - Périmètre brachial pour l'âge (MUAC-for-Age).
//  * @property TSF_FOR_AGE - Pli cutané tricipital pour l'âge (TSF-for-Age).
//  * @property SSF_FOR_AGE - Pli cutané sous-scapulaire pour l'âge (SSF-for-Age).
//  * @property HC_FOR_AGE - Périmètre crânien pour l'âge (Head Circumference-for-Age).
//  * @property AGE_IN_DAY - Âge exprimé en jours.
//  * @property AGE_IN_MONTH - Âge exprimé en mois.
//  */
// export enum AnthroSystemCodes {
//    HEIGHT = "height",
//    LENGTH = "length",
//    LENHEI = "lenhei",
//    WEIGHT = "weight",
//    BMI = "bmi",
//    HEAD_CIRCUMFERENCE = "head_circumference",
//    MUAC = "muac",
//    TSF = "tsf",
//    SSF = "ssf",
//    WFLH = "wflh",
//    WFLH_UNISEXE = "wflh_unisexe",
//    WFA = "wfa",
//    HFA = "hfa",
//    BMI_FOR_AGE = "bmi_for_age",
//    MUAC_FOR_AGE = "muac_for_age",
//    TSF_FOR_AGE = "tsf_for_age",
//    SSF_FOR_AGE = "ssf_for_age",
//    HC_FOR_AGE = "hc_for_age",
//    AGE_IN_DAY = "age_in_day",
//    AGE_IN_MONTH = "age_in_month",
//    SEX = "sex",
// }

// export const MAX_WEIGHT = 58.0;
// export const MIN_WEIGHT = 0.9;
// export const MIN_LENHEI = 38.0;
// export const MAX_LENHEI = 150.0;

// export const MAX_AGE_TO_USE_AGE_IN_DAY = DAY_IN_YEARS * 5;
// export enum ZScoreComputingStrategyType {
//    AGEBASED = "age_based",
//    LENHEIBASED = "lenhei_based",
//    TABLEBASED = "table_based",
// }
// export const DAY_IN_TWO_YEARS = Math.round(DAY_IN_YEARS * 2);
// export const ZScoreVarName = "zscore";
export * from "./../../../../constants"