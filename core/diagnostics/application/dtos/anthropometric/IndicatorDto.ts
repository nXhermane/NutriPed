import { AggregateID } from "@shared";
import {
  ICondition,
  IFormula,
  StandardShape,
  ZScoreComputingStrategyType,
} from "../../../domain";
import { AvailableChartDto } from "./AvailableChartDto";
import { IndicatorInterpreterDto } from "./IndicatorInterpreterDto";
import { AvailableTableDto } from "./AvailableTable";

export interface IndicatorDto {
  id: AggregateID;
  code: string;
  name: string;
  neededMeasureCodes: string[];
  axeX: IFormula;
  axeY: IFormula;
  availableRefCharts: AvailableChartDto[];
  availableRefTables: AvailableTableDto[];
  usageConditions: ICondition;
  interpretations: IndicatorInterpreterDto[];
  zScoreComputingStrategy: ZScoreComputingStrategyType;
  standardShape: StandardShape;
  createdAt: string;
  updatedAt: string;
}
