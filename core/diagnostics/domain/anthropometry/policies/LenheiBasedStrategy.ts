import { ArgumentInvalidException } from "@shared";
import {
  GrowthReferenceChart,
  GrowthReferenceTable,
  GrowthStandard,
  MAX_LENHEI,
  MAX_WEIGHT,
  MIN_LENHEI,
  MIN_WEIGHT,
  ZScoreComputingStrategyType,
} from "../models";
import { IAnthroComputingHelper } from "./interfaces/AnthroComputingHelper";
import {
  AbstractZScoreComputingStrategy,
  ZScoreComputingData,
} from "./interfaces/ZScoreComputingStrategy";

export class LenheiBasedStrategy extends AbstractZScoreComputingStrategy {
  standard: GrowthStandard = GrowthStandard.OMS;
  type: ZScoreComputingStrategyType = ZScoreComputingStrategyType.LENHEIBASED;
  constructor(private anthropComputingHelper: IAnthroComputingHelper) {
    super();
  }
  computeZScore<T extends GrowthReferenceChart | GrowthReferenceTable>(
    data: ZScoreComputingData<T>
  ): number {
    const isTable = this.isGrowthReferenceTable(data.growthReference);
    if (isTable) return NaN;
    const measurements = data.measurements;
    const growthReferenceChart = data.growthReference as GrowthReferenceChart;
    if (growthReferenceChart.getStandard() != this.standard) {
      throw new ArgumentInvalidException(
        `The provided GrowthReferenceChart is invalid. Please chose GrowthReferenceChart of ${this.standard}`
      );
    }
    const { x, y } = measurements;
    // Filtrage pour ne prendre en charge que des valeurs valides
    const weight = y < MIN_WEIGHT || y > MAX_WEIGHT ? NaN : x;
    const lenhei = x < MIN_LENHEI || x > MAX_LENHEI ? NaN : y;
    // Interpolation des tailles
    const lowLenhei = Math.trunc(lenhei * 10) / 10;
    const uppLenhei = Math.trunc(lenhei * 10 + 1) / 10;
    const diffLenhei = (lenhei - lowLenhei) / 0.1;
    let zScore = NaN;
    if (!isNaN(weight) && !isNaN(lenhei)) {
      const standardLow = growthReferenceChart
        .getChartData()
        .find(chartData => chartData.value === lowLenhei);
      const standardUpp = growthReferenceChart
        .getChartData()
        .find(chartData => chartData.value === uppLenhei);
      if (standardLow && standardUpp) {
        const m =
          diffLenhei > 0
            ? standardLow.median +
              diffLenhei * (standardUpp.median - standardLow.median)
            : standardLow.median;
        const l =
          diffLenhei > 0
            ? standardLow.l + diffLenhei * (standardUpp.l - standardLow.l)
            : standardLow.l;
        const s =
          diffLenhei > 0
            ? standardLow.s + diffLenhei * (standardUpp.s - standardLow.s)
            : standardLow.s;
        zScore = Math.round(
          this.anthropComputingHelper.computeZScoreAdjusted(weight, l, m, s)
        );
      }
    }
    return zScore;
  }
}
