import { GrowthIndicatorRange, StandardShape, ZScoreComputingStrategyType } from "@core/constants";


export interface CreateIndicatorProps {
  code: string;
  name: string;
  neededMeasureCodes: string[];
  axeX: IFormula;
  axeY: IFormula;
  availableRefCharts: CreateAvailableChart[];
  availableRefTables: CreateAvailableTableProps[];
  usageConditions: ICondition;
  interpretations: CreateIndicatorInterpreter[];
  zScoreComputingStrategy: ZScoreComputingStrategyType;
  standardShape: StandardShape;
}

interface CreateIndicatorInterpreter {
  name: string;
  code: string;
  range: GrowthIndicatorRange; // Cela va remplacer l'utilisation de condition plustard
  condition: ICondition;
}


export interface CreateAvailableTableProps {
  tableCode: string;
  condition: ICondition;
}

export interface ICondition {
  value: string;
  variables: string[];
}

export interface CreateAvailableChart {
  chartCode: string;
  condition: ICondition;
}
export interface IFormula {
  value: string;
  variables: string[];
}

