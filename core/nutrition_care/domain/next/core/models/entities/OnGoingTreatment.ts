import { TREATMENT_PLAN_IDS } from "@/core/constants";
import {
  AggregateID,
  ArgumentInvalidException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import { ValueOf } from "@/utils";
import {
  CreateOnGoingTreatmentRecommendation,
  IOnGoingTreatmentRecommendation,
  OnGoingTreatmentRecommendation,
} from "../valueObjects";
import { IDuration, IFrequency } from "@/core/nutrition_care/domain/modules";

export enum OnGoingTreatmentStatus {
  ACTIVE = "active",
  STOPPED = "stopped",
  COMPLETED = "completed",
}
export interface IOnGoingTreatment extends EntityPropsBaseType {
  code: SystemCode<ValueOf<typeof TREATMENT_PLAN_IDS>>;
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  status: OnGoingTreatmentStatus;
  nextActionDate: DomainDateTime | null;
  lastExecutionDate: DomainDateTime | null;
  recommendation: OnGoingTreatmentRecommendation;
}

export interface CreateOnGoindTreatment {
  code: ValueOf<typeof TREATMENT_PLAN_IDS>;
  startDate?: string;
  endDate: string | null;
  status?: OnGoingTreatmentStatus;
  nextActionDate: string | null;
  lastExecutionDate?: string | null;
  recommendation: CreateOnGoingTreatmentRecommendation;
}

export class OnGoingTreatment extends Entity<IOnGoingTreatment> {
  getCode(): ValueOf<typeof TREATMENT_PLAN_IDS> {
    return this.props.code.unpack();
  }
  getStartDate(): string {
    return this.props.startDate.toString();
  }
  getEndDate(): string | null {
    return this.props.endDate ? this.props.endDate.toString() : null;
  }
  getNextActionDate(): string | null {
    return this.props.nextActionDate
      ? this.props.nextActionDate.toString()
      : null;
  }
  getLastExecutionDate(): string | null {
    return this.props.lastExecutionDate
      ? this.props.lastExecutionDate.toString()
      : null;
  }
  getStatus(): OnGoingTreatmentStatus {
    return this.props.status;
  }
  getRecommendation(): IOnGoingTreatmentRecommendation {
    return this.props.recommendation.unpack();
  }
  stopTreatment(): void {
    this.props.status = OnGoingTreatmentStatus.STOPPED;
    this.validate();
  }
  activeTreatment(): void {
    this.props.status = OnGoingTreatmentStatus.ACTIVE;
    this.validate();
  }
  completedTreatment(): void {
    this.props.status = OnGoingTreatmentStatus.COMPLETED;
    this.props.endDate = DomainDateTime.now();
    this.validate();
  }
  changeEndDate(endDate: DomainDateTime | null) {
    this.props.endDate = endDate;
    this.validate();
  }
  changeNextActionDate(nextActionDate: DomainDateTime | null) {
    this.props.nextActionDate = nextActionDate;
    this.validate();
  }

  /**
   * Définit la prochaine date d'action
   * Cette méthode doit être appelée par un service de domaine
   */
  setNextActionDate(
    nextActionDate: DomainDateTime | null,
    shouldComplete: boolean = false
  ): void {
    this.props.nextActionDate = nextActionDate;

    if (shouldComplete && this.props.status === OnGoingTreatmentStatus.ACTIVE) {
      this.completedTreatment();
    } else {
      this.validate();
    }
  }

  /**
   * Enregistre l'exécution d'une action et met à jour lastExecutionDate
   */
  recordExecution(executionDate: DomainDateTime): void {
    this.props.lastExecutionDate = executionDate;
    this.validate();
  }

  /**
   * Vérifie si le traitement est dû pour exécution à une date donnée
   */
  isDueForExecution(targetDate: DomainDateTime): boolean {
    if (!this.props.nextActionDate) return false;
    if (this.props.status !== OnGoingTreatmentStatus.ACTIVE) return false;

    return (
      targetDate.isSameDay(this.props.nextActionDate) ||
      targetDate.isAfter(this.props.nextActionDate)
    );
  }

  /**
   * Obtient les données nécessaires pour le calcul de la prochaine date
   */
  getDateCalculationData(): {
    startDate: DomainDateTime;
    endDate: DomainDateTime | null;
    frequency: IFrequency;
    duration: IDuration;
  } {
    const recommendation = this.getRecommendation();
    return {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      frequency: recommendation.frequency.unpack(),
      duration: recommendation.duration.unpack(),
    };
  }

  public validate(): void {
    this._isValid = false;
    if (
      Guard.isEmpty(this.props.endDate).succeeded &&
      Guard.isEmpty(this.props.nextActionDate).succeeded
    ) {
      throw new ArgumentInvalidException(
        "If the end date is empty, the next action date must be provided"
      );
    }
    if (
      this.props.nextActionDate &&
      this.props.nextActionDate.isBefore(this.props.startDate)
    ) {
      throw new ArgumentInvalidException(
        "The next action date cannot be before the start date"
      );
    }
    if (
      this.props.status === OnGoingTreatmentStatus.COMPLETED &&
      Guard.isEmpty(this.props.endDate).succeeded
    ) {
      throw new ArgumentInvalidException(
        "The end date must be provided when the status is completed"
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateOnGoindTreatment,
    id: AggregateID
  ): Result<OnGoingTreatment> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const startDateRes = DomainDateTime.create(createProps.startDate);
      const endDateRes = createProps.endDate
        ? DomainDateTime.create(createProps.endDate)
        : Result.ok(null);
      const nextActionDateRes = createProps.nextActionDate
        ? DomainDateTime.create(createProps.nextActionDate)
        : Result.ok(null);
      const lastExecutionDateRes = createProps.lastExecutionDate
        ? DomainDateTime.create(createProps.lastExecutionDate)
        : Result.ok(null);
      const recommendationRes = OnGoingTreatmentRecommendation.create(
        createProps.recommendation
      );
      const combinedRes = Result.combine([
        codeRes,
        startDateRes,
        endDateRes,
        nextActionDateRes,
        lastExecutionDateRes,
        recommendationRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, OnGoingTreatment.name));
      }
      return Result.ok(
        new OnGoingTreatment({
          id,
          props: {
            code: codeRes.val,
            startDate: startDateRes.val,
            endDate: endDateRes.val,
            nextActionDate: nextActionDateRes.val,
            lastExecutionDate: lastExecutionDateRes.val,
            status: createProps.status || OnGoingTreatmentStatus.ACTIVE,
            recommendation: recommendationRes.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
