import {
  ValueObject,
  Guard,
  ArgumentInvalidException,
  Result,
  handleError,
} from "@shared";

export interface IPhaseTransitionCriteria {
  entryConditions: TransitionCondition[];
  exitConditions: TransitionCondition[];
  failureConditions: TransitionCondition[];
  minimumDuration: number; // days
  maximumDuration: number; // days
  requiredAssessments: RequiredAssessment[];
  contraindications: string[];
  notes: string;
}

export interface TransitionCondition {
  parameter: string; // e.g., "weight_gain", "appetite_test_result"
  operator: ComparisonOperator;
  value: number | string;
  unit?: string;
  timeframe: number; // days over which condition must be met
  consecutive: boolean; // must be consecutive days
  description: string;
}

export interface RequiredAssessment {
  assessmentType: AssessmentType;
  frequency: AssessmentFrequency;
  passingCriteria: string;
  mandatory: boolean;
}

export enum ComparisonOperator {
  GREATER_THAN = "greater_than",
  GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
  LESS_THAN = "less_than",
  LESS_THAN_OR_EQUAL = "less_than_or_equal",
  EQUAL = "equal",
  NOT_EQUAL = "not_equal",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  BETWEEN = "between",
  IMPROVING = "improving",
  STABLE = "stable",
  DETERIORATING = "deteriorating"
}

export enum AssessmentType {
  APPETITE_TEST = "appetite_test",
  ANTHROPOMETRIC = "anthropometric",
  CLINICAL_EXAMINATION = "clinical_examination",
  LABORATORY = "laboratory",
  NUTRITIONAL_INTAKE = "nutritional_intake",
  COMPLICATION_SCREENING = "complication_screening",
  PSYCHOLOGICAL = "psychological"
}

export enum AssessmentFrequency {
  DAILY = "daily",
  EVERY_3_DAYS = "every_3_days",
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  AS_NEEDED = "as_needed"
}

export class PhaseTransitionCriteria extends ValueObject<IPhaseTransitionCriteria> {
  protected validate(props: Readonly<IPhaseTransitionCriteria>): void {
    if (Guard.isNegativeOrZero(props.minimumDuration).succeeded) {
      throw new ArgumentInvalidException("Minimum duration must be positive");
    }
    
    if (Guard.isNegativeOrZero(props.maximumDuration).succeeded) {
      throw new ArgumentInvalidException("Maximum duration must be positive");
    }

    if (props.minimumDuration > props.maximumDuration) {
      throw new ArgumentInvalidException("Minimum duration cannot be greater than maximum duration");
    }

    // Validate conditions
    const allConditions = [
      ...props.entryConditions,
      ...props.exitConditions,
      ...props.failureConditions
    ];

    allConditions.forEach((condition, index) => {
      if (Guard.isNullOrUndefined(condition.parameter).succeeded || condition.parameter.trim() === "") {
        throw new ArgumentInvalidException(`Condition ${index}: parameter cannot be empty`);
      }
      if (Guard.isNegativeOrZero(condition.timeframe).succeeded) {
        throw new ArgumentInvalidException(`Condition ${index}: timeframe must be positive`);
      }
    });

    // Validate required assessments
    props.requiredAssessments.forEach((assessment, index) => {
      if (Guard.isNullOrUndefined(assessment.passingCriteria).succeeded || assessment.passingCriteria.trim() === "") {
        throw new ArgumentInvalidException(`Assessment ${index}: passing criteria cannot be empty`);
      }
    });
  }

  get entryConditions(): TransitionCondition[] {
    return this.props.entryConditions;
  }

  get exitConditions(): TransitionCondition[] {
    return this.props.exitConditions;
  }

  get failureConditions(): TransitionCondition[] {
    return this.props.failureConditions;
  }

  get minimumDuration(): number {
    return this.props.minimumDuration;
  }

  get maximumDuration(): number {
    return this.props.maximumDuration;
  }

  get requiredAssessments(): RequiredAssessment[] {
    return this.props.requiredAssessments;
  }

  get contraindications(): string[] {
    return this.props.contraindications;
  }

  // Check if entry conditions are met
  canEnterPhase(patientData: { [key: string]: any }): boolean {
    return this.evaluateConditions(this.props.entryConditions, patientData);
  }

  // Check if exit conditions are met
  canExitPhase(patientData: { [key: string]: any }): boolean {
    return this.evaluateConditions(this.props.exitConditions, patientData);
  }

  // Check if failure conditions are met
  hasFailureConditions(patientData: { [key: string]: any }): boolean {
    return this.evaluateConditions(this.props.failureConditions, patientData);
  }

  // Get mandatory assessments only
  getMandatoryAssessments(): RequiredAssessment[] {
    return this.props.requiredAssessments.filter(assessment => assessment.mandatory);
  }

  // Check if duration is within acceptable range
  isDurationValid(actualDuration: number): boolean {
    return actualDuration >= this.props.minimumDuration && 
           actualDuration <= this.props.maximumDuration;
  }

  // Get conditions by parameter
  getConditionsByParameter(parameter: string): TransitionCondition[] {
    const allConditions = [
      ...this.props.entryConditions,
      ...this.props.exitConditions,
      ...this.props.failureConditions
    ];
    return allConditions.filter(condition => condition.parameter === parameter);
  }

  private evaluateConditions(conditions: TransitionCondition[], patientData: { [key: string]: any }): boolean {
    if (conditions.length === 0) return true;

    return conditions.every(condition => {
      const patientValue = patientData[condition.parameter];
      if (patientValue === undefined || patientValue === null) return false;

      return this.evaluateCondition(condition, patientValue);
    });
  }

  private evaluateCondition(condition: TransitionCondition, value: any): boolean {
    switch (condition.operator) {
      case ComparisonOperator.GREATER_THAN:
        return Number(value) > Number(condition.value);
      case ComparisonOperator.GREATER_THAN_OR_EQUAL:
        return Number(value) >= Number(condition.value);
      case ComparisonOperator.LESS_THAN:
        return Number(value) < Number(condition.value);
      case ComparisonOperator.LESS_THAN_OR_EQUAL:
        return Number(value) <= Number(condition.value);
      case ComparisonOperator.EQUAL:
        return value === condition.value;
      case ComparisonOperator.NOT_EQUAL:
        return value !== condition.value;
      case ComparisonOperator.CONTAINS:
        return String(value).includes(String(condition.value));
      case ComparisonOperator.NOT_CONTAINS:
        return !String(value).includes(String(condition.value));
      default:
        return false;
    }
  }

  static create(props: IPhaseTransitionCriteria): Result<PhaseTransitionCriteria> {
    try {
      return Result.ok(new PhaseTransitionCriteria(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
