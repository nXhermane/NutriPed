import { IAnthroComputingHelper } from "./interfaces/AnthroComputingHelper";

export class AnthroComputingHelper implements IAnthroComputingHelper {
  computeZScore(y: number, L: number, M: number, S: number): number {
    return (Math.pow(y / M, L) - 1) / (S * L); // CHANGE : j'ai fixer ceci lors du debogage du beta sinon c'etait M * S changer en S * L
  }
  computeZScoreAdjusted(y: number, L: number, M: number, S: number): number {
    const zScore = this.computeZScore(y, L, M, S);
    const SD3pos = this.computeY(3, L, M, S);
    const SD3neg = this.computeY(-3, L, M, S);
    const SD23pos = SD3pos - this.computeY(2, L, M, S);
    const SD23neg = this.computeY(-2, L, M, S) - SD3neg;
    if (!isNaN(zScore)) {
      if (zScore > 3) return 3 + (y - SD3pos) / SD23pos;
      if (zScore < -3) return -3 + (y - SD3neg) / SD23neg;
    }
    return zScore;
  }

  /**
   * Determine la valeur observée a partir de la valeur de z
   * @param SD : C'est une valeur de z
   * @param L
   * @param M
   * @param S
   * @returns la valeur de Y
   */
  private computeY(SD: number, L: number, M: number, S: number): number {
    return M * Math.pow(1 + L * S * SD, 1 / L);
  }

  roundUpAge(age_in_day: number): number {
    return Math.ceil(age_in_day);
  }
}
