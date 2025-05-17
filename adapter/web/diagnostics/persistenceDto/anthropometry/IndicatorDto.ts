import { GrowthIndicatorRange, StandardShape, ZScoreComputingStrategyType } from "@core/constants";
import { EntityPersistenceDto } from "../../../common";
import { ICondition, IFormula } from "@shared";

export interface IndicatorPersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   neededMeasureCodes: string[];
   axeX: IFormula;
   axeY: IFormula;
   availableRefCharts: { chartCode: string; condition: ICondition }[];
   usageCondition: ICondition;
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
