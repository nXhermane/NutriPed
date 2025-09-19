import { CARE_PHASE_CODES } from "@/core/constants";
import {
  AggregateID,
  ArgumentNotProvidedException,
  CreateCriterion,
  Criterion,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  ICriterion,
  Result,
  SystemCode,
} from "@/core/shared";

export interface IOrientationReference extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  criteria: Criterion[];
  treatmentPhase: SystemCode<CARE_PHASE_CODES> | undefined;
}

export interface CreateOrientationReference {
  name: string;
  code: string;
  criteria: CreateCriterion[];
  treatmentPhase: CARE_PHASE_CODES | undefined;
}

export class OrientationReference extends Entity<IOrientationReference> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getCriteria(): ICriterion[] {
    return this.props.criteria.map(criteria => criteria.unpack());
  }
  getTreatmentPhase(): CARE_PHASE_CODES | undefined {
    return this.props.treatmentPhase?.unpack();
  }

  changeName(newName: string): void {
    this.props.name = newName;
  }

  changeCode(newCode: SystemCode): void {
    this.props.code = newCode;
  }

  changeCriteria(newCriteria: Criterion[]): void {
    this.props.criteria = newCriteria;
  }

  changeTreatmentPhase(
    newTreatmentPhase: SystemCode<CARE_PHASE_CODES> | undefined
  ): void {
    this.props.treatmentPhase = newTreatmentPhase;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError(
        "The name of orientation reference can't be empty."
      );
    }
    if (Guard.isEmpty(this.props.criteria).succeeded) {
      throw new ArgumentNotProvidedException(
        "The orientation reference criteria must be provided."
      );
    }
    this._isValid = true;
  }

  static create(
    createProps: CreateOrientationReference,
    id: AggregateID
  ): Result<OrientationReference> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const treatmentPhaseRes = createProps.treatmentPhase
        ? SystemCode.create(createProps.treatmentPhase)
        : Result.ok(undefined);
      const criterionRes = createProps.criteria.map(props =>
        Criterion.create(props)
      );
      const combinedRes = Result.combine([
        codeRes,
        treatmentPhaseRes as never,
        ...criterionRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, OrientationReference.name));
      }
      return Result.ok(
        new OrientationReference({
          id,
          props: {
            code: codeRes.val,
            name: createProps.name,
            criteria: criterionRes.map(res => res.val),
            treatmentPhase: treatmentPhaseRes.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
