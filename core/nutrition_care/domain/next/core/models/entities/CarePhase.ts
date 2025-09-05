import { CARE_PHASE_CODES } from "@/core/constants";
import {
  AggregateID,
  ArgumentOutOfRangeException,
  BaseEntityProps,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  InvalidObject,
  Result,
  SystemCode,
} from "@/core/shared";
import {
  CreateMonitoringParameter,
  IMonitoringParameter,
  MonitoringParameter,
} from "./MonitoringParameter";
import {
  CreateOnGoindTreatment,
  IOnGoingTreatment,
  OnGoingTreatment,
} from "./OnGoingTreatment";
export enum CarePhaseStatus {
  FAILED = "failed",
  SUCCEED = "succeed",
  IN_PROGRESS = "in_progress",
}
export interface ICarePhase extends EntityPropsBaseType {
  code: SystemCode<CARE_PHASE_CODES>;
  status: CarePhaseStatus;
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  monitoringParameters: MonitoringParameter[];
  onGoingTreatments: OnGoingTreatment[];
}

export interface CreateCarePhase {
  code: CARE_PHASE_CODES;
  status?: CarePhaseStatus;
  startDate?: string;
  endDate?: string | null;
  monitoringParameters: (CreateMonitoringParameter & { id: AggregateID })[];
  onGoingTreatments: (CreateOnGoindTreatment & { id: AggregateID })[];
}

export class CarePhase extends Entity<ICarePhase> {
  getCode(): CARE_PHASE_CODES {
    return this.props.code.unpack();
  }
  getStatus(): CarePhaseStatus {
    return this.props.status;
  }
  getStartDate(): string {
    return this.props.startDate.toString();
  }
  getEndDate(): string | null {
    return this.props.endDate ? this.props.endDate.toString() : null;
  }
  getMonitoringParameters(): (IMonitoringParameter & BaseEntityProps)[] {
    return this.props.monitoringParameters.map(entity => entity.getProps());
  }
  getOnGoingTreatments(): (IOnGoingTreatment & BaseEntityProps)[] {
    return this.props.onGoingTreatments.map(entity => entity.getProps());
  }
  addMonitoringParameter(monitoringParameter: MonitoringParameter) {
    this.props.monitoringParameters.push(monitoringParameter);
    this.validate();
  }
  addOnGoingTreatment(onGoingTreatment: OnGoingTreatment) {
    this.props.onGoingTreatments.push(onGoingTreatment);
    this.validate();
  }
  changeMonitoringParameter(monitoringParameter: MonitoringParameter) {
    const findedIndex = this.props.monitoringParameters.findIndex(entity =>
      entity.equals(monitoringParameter)
    );
    if (findedIndex !== -1) {
      this.props.monitoringParameters[findedIndex] = monitoringParameter;
    }
  }
  changeOnGoingTreatment(onGoingTreatment: OnGoingTreatment) {
    const findedIndex = this.props.onGoingTreatments.findIndex(entity =>
      entity.equals(onGoingTreatment)
    );
    if (findedIndex !== -1) {
      this.props.onGoingTreatments[findedIndex] = onGoingTreatment;
    }
  }
  carePhaseFailed() {
    this.props.status = CarePhaseStatus.FAILED;
    this.props.endDate = DomainDateTime.now();
    this.validate();
  }
  carePhaseSucceed() {
    this.props.status = CarePhaseStatus.SUCCEED;
    this.props.endDate = DomainDateTime.now();
    this.validate();
  }
  carePhaseInProgress() {
    this.props.status = CarePhaseStatus.IN_PROGRESS;
    this.props.endDate = null;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    if (
      this.props.endDate &&
      this.props.startDate.isAfter(this.props.endDate)
    ) {
      throw new ArgumentOutOfRangeException(
        "The start date cannot come after the end date."
      );
    }
    if (
      this.props.endDate &&
      this.props.status === CarePhaseStatus.IN_PROGRESS
    ) {
      throw new InvalidObject(
        "The end date can't be provided when the care phase keep in progress."
      );
    }
    if (
      [CarePhaseStatus.FAILED, CarePhaseStatus.SUCCEED].includes(
        this.props.status
      ) &&
      this.props.endDate === null
    ) {
      throw new InvalidObject(
        "The end date must be provided when the care phase failed or succeed."
      );
    }

    this._isValid = true;
  }

  static create(
    createProps: CreateCarePhase,
    id: AggregateID
  ): Result<CarePhase> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const startDateRes = DomainDateTime.create(createProps.startDate);
      const endDateRes = createProps.endDate
        ? DomainDateTime.create(createProps.endDate)
        : Result.ok(null);
      const monitoringParameterRes = createProps.monitoringParameters.map(
        parameter => MonitoringParameter.create(parameter, parameter.id)
      );
      const onGoingTreatmentRes = createProps.onGoingTreatments.map(treatment =>
        OnGoingTreatment.create(treatment, treatment.id)
      );
      const combinedRes = Result.combine([
        codeRes,
        endDateRes,
        startDateRes,
        ...monitoringParameterRes,
        ...onGoingTreatmentRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, CarePhase.name));
      }
      return Result.ok(
        new CarePhase({
          id,
          props: {
            code: codeRes.val,
            startDate: startDateRes.val,
            endDate: endDateRes.val,
            monitoringParameters: monitoringParameterRes.map(res => res.val),
            onGoingTreatments: onGoingTreatmentRes.map(res => res.val),
            status: createProps.status || CarePhaseStatus.IN_PROGRESS,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
