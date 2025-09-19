import { CARE_PHASE_CODES } from "@/core/constants";
import {
  AggregateID,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";

export interface IOrientationRecord extends EntityPropsBaseType {
  code: SystemCode;
  treatmentPhase: SystemCode<CARE_PHASE_CODES> | null;
  recordedAt: DomainDateTime;
}
export interface CreateOrientationRecord {
  code: string;
  treatmentPhase: CARE_PHASE_CODES | null;
  recordedAt?: string;
}

export class OrientationRecord extends Entity<IOrientationRecord> {
  getCode(): string {
    return this.props.code.unpack();
  }
  getTreatmentPhase(): CARE_PHASE_CODES | null {
    return this.props.treatmentPhase !== null
      ? this.props.treatmentPhase.unpack()
      : this.props.treatmentPhase;
  }
  getRecordedAt(): string {
    return this.props.recordedAt.toString();
  }
  changeCode(code: SystemCode) {
    this.props.code = code;
    this.validate();
  }
  changeTreatmentPhase(phase: SystemCode<CARE_PHASE_CODES> | null) {
    this.props.treatmentPhase = phase;
    this.validate();
  }

  public validate(): void {
    this._isValid = false;
    // Implement the validation rule here if needed it ...
    this._isValid = true;
  }
  static create(
    createProps: CreateOrientationRecord,
    id: AggregateID
  ): Result<OrientationRecord> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const phaseCode = createProps.treatmentPhase
        ? SystemCode.create(createProps.treatmentPhase)
        : Result.ok(null);
      const recordAtRes = createProps.recordedAt
        ? DomainDateTime.create(createProps.recordedAt)
        : DomainDateTime.create();
      const combinedRes = Result.combine([
        codeRes,
        phaseCode as any,
        recordAtRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, OrientationRecord.name));
      }
      return Result.ok(
        new OrientationRecord({
          id,
          props: {
            code: codeRes.val,
            treatmentPhase: phaseCode.val,
            recordedAt: recordAtRes.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
