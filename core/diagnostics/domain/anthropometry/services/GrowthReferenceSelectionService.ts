import { ConditionResult, evaluateCondition, handleError, Result } from "@shared";
import { AnthropometricVariableObject } from "../common";
import { Indicator, GrowthStandard, GrowthReferenceChart, AvailableChart, GrowthReferenceTable, AvailableTable } from "../models";
import { IReferenceSelectionService } from "./interfaces/GrowthReferenceSelectionService";
import { GrowthReferenceChartRepository, GrowthReferenceTableRepository } from "../ports";
import { handleGrowthIndicatorError } from "../errors/handle";
import { GROWTH_INDICATOR_ERRORS } from "../errors";

export class GrowthReferenceSelectionService implements IReferenceSelectionService {
   constructor(private growthReferenceChartRepo: GrowthReferenceChartRepository, private growthReferenceTableRepo: GrowthReferenceTableRepository) {}
   async selectTableForIndicator(
      data: AnthropometricVariableObject,
      indicator: Indicator,
      standard: GrowthStandard,
   ): Promise<Result<GrowthReferenceTable>> {
      try {
         const availableTables = indicator.getProps().availableRefTables;
         const selectedTable = availableTables.find((table) => this.validateCondition(table, data, standard));
         if (!selectedTable) {
            return handleGrowthIndicatorError(
               GROWTH_INDICATOR_ERRORS.CHART.NOT_AVAILABLE.path,
               `Indicator: ${indicator.getCode()}, Table: ${standard}`,
            );
         }
         const growthReferenceTable = await this.growthReferenceTableRepo.getByCode(selectedTable.unpack().tableCode);
         return Result.ok(growthReferenceTable);
      } catch (e) {
         return handleError(e);
      }
   }
   private validateCondition(availableRef: AvailableChart | AvailableTable, data: AnthropometricVariableObject, standard: GrowthStandard): boolean {
      const { condition } = availableRef.unpack();
      const variables = condition.unpack().variables;

      if (!variables.every((variable) => Object.keys(data).includes(variable))) {
         return false;
      }

      return evaluateCondition(condition.unpack().value, { ...data, standard }) === ConditionResult.True;
   }

   async selectChartForIndicator(
      data: AnthropometricVariableObject,
      indicator: Indicator,
      standard: GrowthStandard,
   ): Promise<Result<GrowthReferenceChart>> {
      try {
         const availableCharts = indicator.getProps().availableRefCharts;
         const selectedChart = availableCharts.find((chart) => this.validateCondition(chart, data, standard));

         if (!selectedChart) {
            return handleGrowthIndicatorError(
               GROWTH_INDICATOR_ERRORS.CHART.NOT_AVAILABLE.path,
               `Indicator: ${indicator.getCode()}, Chart: ${standard}`,
            );
         }
         const growthReferenceChart = await this.growthReferenceChartRepo.getByCode(selectedChart.unpack().chartCode);
         return Result.ok(growthReferenceChart);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
