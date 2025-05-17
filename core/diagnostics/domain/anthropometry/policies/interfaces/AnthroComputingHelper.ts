export interface IAnthroComputingHelper {
   /**
    * Calcule le Zscore non ajusté
    * @param y C'est la valeur observée
    * @param L C'est l'indice de puissance pour la tansformation
    * @param M C'est la mediane des valeurs de référence
    * @param S C'est le coefficient de variation
    * @returns {number} Le z-sscore non ajusté
    */
   computeZScore(y: number, L: number, M: number, S: number): number;
   /**
    * Calcule le Zscore ajusté
    * @param y C'est la valeur observée
    * @param L C'est l'indice de puissance pour la tansformation
    * @param M C'est la mediane des valeurs de référence
    * @param S C'est le coefficient de variation
    * @returns {number} Le z-sscore ajusté
    */
   computeZScoreAdjusted(y: number, L: number, M: number, S: number): number;

   roundUpAge(age_in_day: number): number;
}
