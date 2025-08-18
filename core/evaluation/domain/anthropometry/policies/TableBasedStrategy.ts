import {
  GrowthStandard,
  ZScoreComputingStrategyType,
  GrowthReferenceTable,
  GrowthReferenceChart,
  ITableData,
} from "../models";
import {
  AbstractZScoreComputingStrategy,
  ZScoreComputingData,
} from "./interfaces/ZScoreComputingStrategy";

export class TableBasedStrategy extends AbstractZScoreComputingStrategy {
  standard: GrowthStandard = GrowthStandard.OMS;
  type: ZScoreComputingStrategyType = ZScoreComputingStrategyType.TABLEBASED;
  computeZScore<T extends GrowthReferenceTable | GrowthReferenceChart>(
    data: ZScoreComputingData<T>
  ): number {
    const isTable = this.isGrowthReferenceTable(data.growthReference);
    if (!isTable) return NaN;
    const { x: rowValue, y: columnValue } = data.measurements;
    const growthRefTable = data.growthReference as GrowthReferenceTable;
    const tableRow = this.findTableDataCorrespondingToRowValue(
      rowValue,
      growthRefTable
    );
    if (!tableRow) return NaN;
    if (!tableRow.isUnisex && tableRow.sex != data.sex) {
      console.warn(
        `Sexe incompatible : la ligne attend '${tableRow.sex}' mais le patient est de sexe '${data.sex}'`
      );

      return NaN;
    }
    // FIXME: Verifier plustard si cela donne vraiment la bonne valeur
    // if (columnValue <= tableRow.hightSeverNeg) return -4;
    // if (
    //   columnValue > tableRow.hightSeverNeg &&
    //   columnValue <= tableRow.severeNeg
    // )
    //   return -3; // Si c'est c'est inférieur a severeNeg nous allons le mettre a -3
    // else if (
    //   columnValue > tableRow.severeNeg &&
    //   columnValue <= tableRow.moderateNeg
    // )
    //   return -2;
    // else if (
    //   columnValue > tableRow.moderateNeg &&
    //   columnValue <= tableRow.outComeTargetValueNeg
    // )
    //   return -1.5;
    // else if (
    //   columnValue > tableRow.outComeTargetValueNeg &&
    //   columnValue <= tableRow.normalNeg
    // )
    //   return -1;
    // else if (columnValue > tableRow.normalNeg && columnValue <= tableRow.median)
    //   return 0;
    // else if (columnValue > tableRow.median) return 1;
    // else return NaN;
    return this.interpolateZScore(columnValue, tableRow)
  }
  private findTableDataCorrespondingToRowValue(
    rowValue: number,
    growthRefTable: GrowthReferenceTable
  ): ITableData | undefined {
    return growthRefTable
      .getTableData()
      .find(tableData => tableData.value === rowValue);
  }
  private linearInterpolation(value: number, x1: number, y1: number, x2: number, y2: number): number {
    if (x1 == x2) return y1;
    const ratio = (value - x1) / (x2 - x1)
    const result = y1 + ratio * (y2 - y1)
    return Math.round(result * 100) / 100
  }
  private interpolateZScore(value: number, tableRow: ITableData): number {
    const referencePoints = [{
      threshold: tableRow.hightSeverNeg, zScore: -4,
    }, {
      threshold: tableRow.severeNeg, zScore: -3
    }, {
      threshold: tableRow.moderateNeg, zScore: -2
    }, {
      threshold: tableRow.outComeTargetValueNeg, zScore: -1.5
    }, {
      threshold: tableRow.normalNeg, zScore: -1
    }, {
      threshold: tableRow.median, zScore: 0
    }]
    referencePoints.sort((a, b) => a.threshold - b.threshold)
    // Cas extrêmes 
    if (value <= referencePoints[0].threshold) return referencePoints[0].zScore
    if (value >= referencePoints[referencePoints.length - 1].threshold) return referencePoints[referencePoints.length - 1].zScore
    for (let i = 0; i < referencePoints.length - 1; i++) {
      const current = referencePoints[i]
      const next = referencePoints[i + 1]
      if (value >= current.threshold && value <= next.threshold) {
        return this.linearInterpolation(value, current.threshold, current.zScore, next.threshold, next.zScore)
      }
    }
    console.warn("Ce cas ne devrait jamais arriver.")
    return NaN
  }

}
