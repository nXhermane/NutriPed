import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  DomainDate,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  UnitCode,
  ValueObject,
} from "@shared";
export enum DataFieldResponseType {
  WITH_UNIT = "data_field_with_unit",
  WITHOUT_UNIT = "data_field_without_unit",
}
export interface IDataFieldResponse {
  code: SystemCode;
  unit?: UnitCode;
  value: number | string | boolean;
  type: DataFieldResponseType;
  recodedAt: DomainDate;
}

export interface CreateDataFieldResponse {
  code: string;
  unit?: string;
  value: number | string | boolean;
  type: DataFieldResponseType;
  recordedAt?: string;
}
export class DataFieldResponse extends ValueObject<IDataFieldResponse> {
  isWithUnit() {
    return this.props.type === DataFieldResponseType.WITH_UNIT;
  }
  protected validate(props: Readonly<IDataFieldResponse>): void {
    if (props.type === DataFieldResponseType.WITH_UNIT) {
      if (Guard.isEmpty(props.unit).succeeded) {
        throw new ArgumentNotProvidedException(
          "The unit must be provided when the datafield type is with unit."
        );
      }
      if (!Guard.isNumber(props.value).succeeded) {
        throw new ArgumentInvalidException(
          "The value must be number if is with unit datafield."
        );
      }
    }
  }

  static create(
    createProps: CreateDataFieldResponse
  ): Result<DataFieldResponse> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit || "kg");
      const recordedAtRes = createProps.recordedAt
        ? DomainDate.create(createProps.recordedAt)
        : DomainDate.create();
      const combinedRes = Result.combine([codeRes, unitRes, recordedAtRes]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, DataFieldResponse.name));
      return Result.ok(
        new DataFieldResponse({
          code: codeRes.val,
          unit: createProps.unit ? unitRes.val : undefined,
          value: createProps.value,
          recodedAt: recordedAtRes.val,
          type: createProps.type,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
