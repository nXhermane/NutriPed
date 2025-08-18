import { Sex } from "@shared";
import {
  GrowthReferenceChart,
  GrowthReferenceTable,
  GrowthStandard,
  ZScoreComputingStrategyType,
} from "../../models";

/**
 * Représente les données nécessaires pour le calcul du Z-score.
 *
 * @property {Object} measurements - Contient les valeurs de référence pour le calcul.
 * @property {number} measurements.x - Peut représenter l'âge en jours (`AGE_IN_DAY`), l'âge en mois (`AGE_IN_MONTH`) ou la taille normalisée (`LENHEI`).
 * @property {number} measurements.y - Valeur anthropométrique observée (ex : poids, taille, périmètre crânien, IMC...).
 * @property {GrowthReferenceChart | GrowthReferenceTable} growthReference - La courbe ou la table de référence de croissance utilisée pour l'interprétation des mesures.
 */
export type ZScoreComputingData<
  T extends GrowthReferenceChart | GrowthReferenceTable,
> = {
  measurements: { x: number; y: number };
  growthReference: T;
  sex: Sex;
};

/**
 * Interface définissant une stratégie de calcul du Z-score.
 */
export interface ZScoreComputingStrategy {
  standard: GrowthStandard;
  type: ZScoreComputingStrategyType;

  /**
   * Calcule le Z-score à partir des données fournies.
   *
   * @param {ZScoreComputingData} data - Les mesures et la courbe de référence à utiliser pour le calcul.
   * @returns {number} - Le Z-score calculé.
   */
  computeZScore<T extends GrowthReferenceTable | GrowthReferenceChart>(
    data: ZScoreComputingData<T>
  ): number;
  isGrowthReferenceTable(
    ref: GrowthReferenceChart | GrowthReferenceTable
  ): boolean;
}

export abstract class AbstractZScoreComputingStrategy
  implements ZScoreComputingStrategy
{
  abstract standard: GrowthStandard;
  abstract type: ZScoreComputingStrategyType;
  abstract computeZScore<T extends GrowthReferenceTable | GrowthReferenceChart>(
    data: ZScoreComputingData<T>
  ): number;
  isGrowthReferenceTable(
    ref: GrowthReferenceChart | GrowthReferenceTable
  ): boolean {
    return "getTableData" in ref;
  }
}
