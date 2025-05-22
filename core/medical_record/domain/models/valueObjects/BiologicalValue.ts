import {
  DomainDate,
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  SystemCode,
  UnitCode,
  ValueObject,
} from "@shared";

export interface IBiologicalValue {
  code: SystemCode;
  value: number;
  unit: UnitCode;
  recordedAt: DomainDate;
}

export interface CreateBiologicalValue {
  code: string;
  value: number;
  unit: string;
  recordedAt?: string;
}
export class BiologicalValue extends ValueObject<IBiologicalValue> {
  protected validate(props: Readonly<IBiologicalValue>): void {
    if (Guard.isNegative(props.value).succeeded) {
      throw new NegativeValueError("The biological value can't be negative.");
    }
  }

  static create(createProps: CreateBiologicalValue): Result<BiologicalValue> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit);
      const recordedAt = createProps.recordedAt
        ? DomainDate.create(createProps.recordedAt)
        : DomainDate.create();
      const combinedRes = Result.combine([codeRes, unitRes, recordedAt]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, BiologicalValue.name));
      return Result.ok(
        new BiologicalValue({
          code: codeRes.val,
          unit: unitRes.val,
          value: createProps.value,
          recordedAt: recordedAt.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
