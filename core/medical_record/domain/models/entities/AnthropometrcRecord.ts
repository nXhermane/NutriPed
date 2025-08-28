import {
  AggregateID,
  ArgumentOutOfRangeException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  SystemCode,
  UnitCode,
} from "@/core/shared";
import { AnthropometricDataContext } from "../types";
import { AnthroSystemCodes } from "@/core/constants";

export interface IAnthropometricRecord extends EntityPropsBaseType {
  code: SystemCode;
  value: number;
  unit: UnitCode;
  recordedAt: DomainDateTime;
  context: AnthropometricDataContext;
}

export interface CreateAnthropometricRecord {
  code: string;
  value: number;
  unit: string;
  context: `${AnthropometricDataContext}`;
  recordedAt?: string;
}
export class AnthropometricRecord extends Entity<IAnthropometricRecord> {
  public validate(): void {
    if (
      !Object.values(AnthroSystemCodes).includes(
        this.props.code.unpack() as AnthroSystemCodes
      )
    ) {
      throw new ArgumentOutOfRangeException(
        "This anthropometric measure is not supported."
      );
    }
    if (Guard.isNegative(this.props.value).succeeded) {
      throw new NegativeValueError(
        "The anthropometric measure value can't be negative."
      );
    }
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getContext(): `${AnthropometricDataContext}` {
    return this.props.context;
  }
  getRecordDate(): string {
    return this.props.recordedAt.unpack();
  }
  getMeasurement(): { value: number; unit: string } {
    return {
      value: this.props.value,
      unit: this.props.unit.unpack(),
    };
  }
  changeMeasurement(measurement: { value: number; unit: UnitCode }) {
    this.props.value = measurement.value;
    this.props.unit = measurement.unit;
    this.validate();
  }
  isFollowUpContext() {
    return this.props.context === AnthropometricDataContext.FOLLOW_UP;
  }
  static create(
    createProps: CreateAnthropometricRecord,
    id: AggregateID
  ): Result<AnthropometricRecord> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit);
      const recordedDate = createProps.recordedAt
        ? DomainDateTime.create(createProps.recordedAt)
        : DomainDateTime.create();
      const combinedRes = Result.combine([codeRes, unitRes, recordedDate]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, AnthropometricRecord.name));
      return Result.ok(
        new AnthropometricRecord({
          id,
          props: {
            code: codeRes.val,
            value: createProps.value,
            unit: unitRes.val,
            recordedAt: recordedDate.val,
            context: createProps.context as AnthropometricDataContext,
          },
        })
      );
    } catch (e) {
      return handleError(e);
    }
  }
}
