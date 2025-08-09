import {
  AggregateID,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  Guard,
  handleError,
  Result,
  formatError,
} from "@shared";
import {
  NutritionalTreatment,
  SystematicTreatment,
  MonitoringElement,
  PhaseTransitionCriteria,
  INutritionalTreatment,
  ISystematicTreatment,
  IMonitoringElement,
  IPhaseTransitionCriteria,
} from "../valueObjects";

export interface ICarePhase extends EntityPropsBaseType {
  name: string;
  description: string;
  phaseType: CarePhaseType;
  nutritionalTreatment: NutritionalTreatment;
  systematicTreatment: SystematicTreatment;
  monitoringElements: MonitoringElement[];
  transitionCriteria: PhaseTransitionCriteria;
  expectedDuration: number; // days
  priority: PhasePriority;
  isActive: boolean;
  notes: string;
}

export interface CreateCarePhaseProps {
  name: string;
  description: string;
  phaseType: CarePhaseType;
  nutritionalTreatment: INutritionalTreatment;
  systematicTreatment: ISystematicTreatment;
  monitoringElements: IMonitoringElement[];
  transitionCriteria: IPhaseTransitionCriteria;
  expectedDuration: number;
  priority: PhasePriority;
  notes: string;
}

export enum CarePhaseType {
  STABILIZATION = "stabilization",
  TRANSITION = "transition",
  REHABILITATION = "rehabilitation",
  MAINTENANCE = "maintenance",
  INTENSIVE_CARE = "intensive_care",
  OUTPATIENT = "outpatient"
}

export enum PhasePriority {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

export class CarePhase extends Entity<ICarePhase> {
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError("CarePhase name can't be empty.");
    }
    if (Guard.isEmpty(this.props.description).succeeded) {
      throw new EmptyStringError("CarePhase description can't be empty.");
    }
    if (Guard.isNegativeOrZero(this.props.expectedDuration).succeeded) {
      throw new EmptyStringError("Expected duration must be positive.");
    }
    this._isValid = true;
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get phaseType(): CarePhaseType {
    return this.props.phaseType;
  }

  get nutritionalTreatment(): NutritionalTreatment {
    return this.props.nutritionalTreatment;
  }

  get systematicTreatment(): SystematicTreatment {
    return this.props.systematicTreatment;
  }

  get monitoringElements(): MonitoringElement[] {
    return this.props.monitoringElements;
  }

  get transitionCriteria(): PhaseTransitionCriteria {
    return this.props.transitionCriteria;
  }

  get expectedDuration(): number {
    return this.props.expectedDuration;
  }

  get priority(): PhasePriority {
    return this.props.priority;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  // Business methods
  activate(): void {
    this.props.isActive = true;
    this.validate();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.validate();
  }

  updateNutritionalTreatment(treatment: NutritionalTreatment): void {
    this.props.nutritionalTreatment = treatment;
    this.validate();
  }

  addMonitoringElement(element: MonitoringElement): void {
    this.props.monitoringElements.push(element);
    this.validate();
  }

  removeMonitoringElement(parameter: string): void {
    this.props.monitoringElements = this.props.monitoringElements.filter(
      element => element.parameter !== parameter
    );
    this.validate();
  }

  // Get high priority monitoring elements
  getHighPriorityMonitoring(): MonitoringElement[] {
    return this.props.monitoringElements.filter(element => element.isHighPriority());
  }

  // Get critical monitoring elements
  getCriticalMonitoring(): MonitoringElement[] {
    return this.props.monitoringElements.filter(
      element => element.priority === "critical"
    );
  }

  // Check if phase can be entered with given patient data
  canEnterPhase(patientData: { [key: string]: any }): boolean {
    return this.props.transitionCriteria.canEnterPhase(patientData);
  }

  // Check if phase can be exited with given patient data
  canExitPhase(patientData: { [key: string]: any }): boolean {
    return this.props.transitionCriteria.canExitPhase(patientData);
  }

  // Check if phase has failure conditions met
  hasFailureConditions(patientData: { [key: string]: any }): boolean {
    return this.props.transitionCriteria.hasFailureConditions(patientData);
  }

  // Get treatment complexity score
  getTreatmentComplexity(): number {
    const nutritionalComplexity = this.props.nutritionalTreatment.nutritionalObjectives.length;
    const systematicComplexity = this.props.systematicTreatment.getComplexityScore();
    const monitoringComplexity = this.props.monitoringElements.length;
    
    return nutritionalComplexity + systematicComplexity + monitoringComplexity;
  }

  // Check if phase is critical priority
  isCriticalPriority(): boolean {
    return this.props.priority === PhasePriority.CRITICAL;
  }

  static create(props: CreateCarePhaseProps, id: AggregateID): Result<CarePhase> {
    try {
      // Create value objects
      const nutritionalTreatmentRes = NutritionalTreatment.create(props.nutritionalTreatment);
      if (nutritionalTreatmentRes.isFailure) {
        return Result.fail(formatError(nutritionalTreatmentRes, CarePhase.name));
      }

      const systematicTreatmentRes = SystematicTreatment.create(props.systematicTreatment);
      if (systematicTreatmentRes.isFailure) {
        return Result.fail(formatError(systematicTreatmentRes, CarePhase.name));
      }

      const monitoringElements: MonitoringElement[] = [];
      for (const elementProps of props.monitoringElements) {
        const elementRes = MonitoringElement.create(elementProps);
        if (elementRes.isFailure) {
          return Result.fail(formatError(elementRes, CarePhase.name));
        }
        monitoringElements.push(elementRes.val);
      }

      const transitionCriteriaRes = PhaseTransitionCriteria.create(props.transitionCriteria);
      if (transitionCriteriaRes.isFailure) {
        return Result.fail(formatError(transitionCriteriaRes, CarePhase.name));
      }

      const carePhase = new CarePhase({
        props: {
          name: props.name,
          description: props.description,
          phaseType: props.phaseType,
          nutritionalTreatment: nutritionalTreatmentRes.val,
          systematicTreatment: systematicTreatmentRes.val,
          monitoringElements,
          transitionCriteria: transitionCriteriaRes.val,
          expectedDuration: props.expectedDuration,
          priority: props.priority,
          isActive: true,
          notes: props.notes,
        },
        id,
      });

      return Result.ok(carePhase);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
