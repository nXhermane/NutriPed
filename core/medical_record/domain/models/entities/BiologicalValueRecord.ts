import {
  AggregateID,
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

export interface IBiologicalValueRecord extends EntityPropsBaseType {
  code: SystemCode;
  value: number;
  unit: UnitCode;
  recordedAt: DomainDateTime;
}
export interface CreateBiologicalValueRecord {
  code: string;
  value: number;
  unit: string;
  recordedAt?: string;
}
export class BiologicalValueRecord extends Entity<IBiologicalValueRecord> {
  public validate(): void {
    if (Guard.isNegative(this.props.value).succeeded) {
      throw new NegativeValueError("The biological value can't be negative.");
    }
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getMeasurement(): { unit: string; value: number } {
    return { unit: this.props.unit.unpack(), value: this.props.value };
  }
  getRecordAt(): string {
    return this.props.recordedAt.unpack();
  }
  changeMeasurement(measurement: { unit: UnitCode; value: number }) {
    this.props.unit = measurement.unit;
    this.props.value = measurement.value;
    this.validate();
  }
  static create(
    createProps: CreateBiologicalValueRecord,
    id: AggregateID
  ): Result<BiologicalValueRecord> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit);
      const recordedAt = createProps.recordedAt
        ? DomainDateTime.create(createProps.recordedAt)
        : DomainDateTime.create();
      const combinedRes = Result.combine([codeRes, unitRes, recordedAt]);
      if (combinedRes.isFailure)
        return Result.fail(
          formatError(combinedRes, BiologicalValueRecord.name)
        );
      return Result.ok(
        new BiologicalValueRecord({
          id,
          props: {
            code: codeRes.val,
            unit: unitRes.val,
            value: createProps.value,
            recordedAt: recordedAt.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
