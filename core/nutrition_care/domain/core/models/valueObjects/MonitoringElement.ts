import {
  ValueObject,
  Guard,
  ArgumentInvalidException,
  Result,
  handleError,
} from "@shared";

export interface IMonitoringElement {
  parameter: string; // e.g., "weight", "height", "temperature"
  frequency: MonitoringFrequency;
  thresholds: MonitoringThreshold[];
  alertConditions: AlertCondition[];
  unit: string;
  category: MonitoringCategory;
  priority: MonitoringPriority;
  instructions: string;
}

export interface MonitoringThreshold {
  type: ThresholdType;
  value: number;
  condition: ComparisonOperator;
  severity: AlertSeverity;
  action: string; // action to take when threshold is crossed
}

export interface AlertCondition {
  description: string;
  condition: string; // logical expression
  severity: AlertSeverity;
  autoEscalate: boolean;
  escalationDelay: number; // minutes
}

export enum MonitoringFrequency {
  CONTINUOUS = "continuous",
  HOURLY = "hourly",
  EVERY_4_HOURS = "every_4_hours",
  EVERY_8_HOURS = "every_8_hours",
  DAILY = "daily",
  TWICE_DAILY = "twice_daily",
  WEEKLY = "weekly",
  AS_NEEDED = "as_needed"
}

export enum MonitoringCategory {
  VITAL_SIGNS = "vital_signs",
  ANTHROPOMETRIC = "anthropometric",
  NUTRITIONAL = "nutritional",
  BIOCHEMICAL = "biochemical",
  CLINICAL = "clinical",
  BEHAVIORAL = "behavioral"
}

export enum MonitoringPriority {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

export enum ThresholdType {
  MINIMUM = "minimum",
  MAXIMUM = "maximum",
  TARGET = "target",
  RANGE = "range"
}

export enum ComparisonOperator {
  LESS_THAN = "less_than",
  LESS_THAN_OR_EQUAL = "less_than_or_equal",
  GREATER_THAN = "greater_than",
  GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
  EQUAL = "equal",
  NOT_EQUAL = "not_equal",
  BETWEEN = "between"
}

export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

export class MonitoringElement extends ValueObject<IMonitoringElement> {
  protected validate(props: Readonly<IMonitoringElement>): void {
    if (Guard.isNullOrUndefined(props.parameter).succeeded || props.parameter.trim() === "") {
      throw new ArgumentInvalidException("Parameter name cannot be empty");
    }
    
    if (Guard.isNullOrUndefined(props.unit).succeeded || props.unit.trim() === "") {
      throw new ArgumentInvalidException("Unit cannot be empty");
    }

    // Validate thresholds
    props.thresholds.forEach((threshold, index) => {
      if (Guard.isNullOrUndefined(threshold.value).succeeded) {
        throw new ArgumentInvalidException(`Threshold ${index}: value cannot be null`);
      }
    });

    // Validate alert conditions
    props.alertConditions.forEach((condition, index) => {
      if (Guard.isNullOrUndefined(condition.condition).succeeded || condition.condition.trim() === "") {
        throw new ArgumentInvalidException(`Alert condition ${index}: condition cannot be empty`);
      }
      if (Guard.isNegative(condition.escalationDelay).succeeded) {
        throw new ArgumentInvalidException(`Alert condition ${index}: escalation delay cannot be negative`);
      }
    });
  }

  get parameter(): string {
    return this.props.parameter;
  }

  get frequency(): MonitoringFrequency {
    return this.props.frequency;
  }

  get thresholds(): MonitoringThreshold[] {
    return this.props.thresholds;
  }

  get alertConditions(): AlertCondition[] {
    return this.props.alertConditions;
  }

  get category(): MonitoringCategory {
    return this.props.category;
  }

  get priority(): MonitoringPriority {
    return this.props.priority;
  }

  // Check if a value triggers any threshold
  checkThresholds(value: number): MonitoringThreshold[] {
    return this.props.thresholds.filter(threshold => {
      switch (threshold.condition) {
        case ComparisonOperator.LESS_THAN:
          return value < threshold.value;
        case ComparisonOperator.LESS_THAN_OR_EQUAL:
          return value <= threshold.value;
        case ComparisonOperator.GREATER_THAN:
          return value > threshold.value;
        case ComparisonOperator.GREATER_THAN_OR_EQUAL:
          return value >= threshold.value;
        case ComparisonOperator.EQUAL:
          return value === threshold.value;
        case ComparisonOperator.NOT_EQUAL:
          return value !== threshold.value;
        default:
          return false;
      }
    });
  }

  // Get critical thresholds only
  getCriticalThresholds(): MonitoringThreshold[] {
    return this.props.thresholds.filter(t => t.severity === AlertSeverity.CRITICAL);
  }

  // Check if monitoring is high priority
  isHighPriority(): boolean {
    return this.props.priority === MonitoringPriority.CRITICAL || 
           this.props.priority === MonitoringPriority.HIGH;
  }

  // Get monitoring interval in minutes
  getIntervalMinutes(): number {
    switch (this.props.frequency) {
      case MonitoringFrequency.CONTINUOUS:
        return 0; // continuous
      case MonitoringFrequency.HOURLY:
        return 60;
      case MonitoringFrequency.EVERY_4_HOURS:
        return 240;
      case MonitoringFrequency.EVERY_8_HOURS:
        return 480;
      case MonitoringFrequency.TWICE_DAILY:
        return 720; // 12 hours
      case MonitoringFrequency.DAILY:
        return 1440; // 24 hours
      case MonitoringFrequency.WEEKLY:
        return 10080; // 7 days
      case MonitoringFrequency.AS_NEEDED:
        return -1; // as needed
      default:
        return 1440; // default to daily
    }
  }

  static create(props: IMonitoringElement): Result<MonitoringElement> {
    try {
      return Result.ok(new MonitoringElement(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
