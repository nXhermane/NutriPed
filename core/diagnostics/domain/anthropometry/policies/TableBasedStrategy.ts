import { GrowthStandard, ZScoreComputingStrategyType, GrowthReferenceTable, GrowthReferenceChart, ITableData } from "../models";
import { AbstractZScoreComputingStrategy, ZScoreComputingData } from "./interfaces/ZScoreComputingStrategy";

export class TableBasedStrategy extends AbstractZScoreComputingStrategy {
   standard: GrowthStandard = GrowthStandard.OMS;
   type: ZScoreComputingStrategyType = ZScoreComputingStrategyType.TABLEBASED;
   computeZScore<T extends GrowthReferenceTable | GrowthReferenceChart>(data: ZScoreComputingData<T>): number {
      const isTable = this.isGrowthReferenceTable(data.growthReference);
      if (!isTable) return NaN;
      const { x: rowValue, y: columnValue } = data.measurements;
      const growthRefTable = data.growthReference as GrowthReferenceTable;
      const tableRow = this.findTableDataCorrespondingToRowValue(rowValue, growthRefTable);
      if (!tableRow) return NaN;
      if (!tableRow.isUnisex && tableRow.sex != data.sex) return NaN;
      // FIXME: Verifier plustard si cela donne vraiment la bonne valeur 
      if (columnValue < tableRow.severeNeg) return -3; // Si c'est c'est inférieur a severeNeg nous allons le mettre a -3
      else if (columnValue < tableRow.moderateNeg) return -2;
      else if (columnValue < tableRow.median) return 0;
      else if (columnValue > tableRow.severePos) return 3;
      else if (columnValue > tableRow.moderatePos) return 2;
      else if (columnValue > tableRow.median) return 0;
      else return NaN;
   }
   private findTableDataCorrespondingToRowValue(rowValue: number, growthRefTable: GrowthReferenceTable): ITableData | undefined {
      return growthRefTable.getTableData().find((tableData) => tableData.value === rowValue);
   }
}
