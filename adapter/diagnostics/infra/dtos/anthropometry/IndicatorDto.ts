import { GrowthIndicatorRange, ZScoreComputingStrategyType, StandardShape } from "@core/constants";
import { IFormula, ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";

export interface IndicatorPersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   neededMeasureCodes: string[];
   axeX: IFormula;
   axeY: IFormula;
   availableRefCharts: { chartCode: string; condition: ICondition }[];
   usageConditions: ICondition;
   interpretations: {
      name: string;
      code: string;
      range: GrowthIndicatorRange;
      condition: ICondition;
   }[];
   zScoreComputingStrategy: ZScoreComputingStrategyType;
   standardShape: StandardShape;
   availableRefTables: { tableCode: string; condition: ICondition }[];
}
