import {
  ArgumentNotProvidedException,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export type DataFieldResponseValue =
  | boolean
  | number
  | string
  | { unit: string; value: number };
export interface IDataFieldResponse {
  code: SystemCode;
  value: DataFieldResponseValue;
}
export interface CreateDataFieldResponse {
  code: string;
  value: DataFieldResponseValue;
}
export class DataFieldResponse extends ValueObject<IDataFieldResponse> {
  getCode(): string {
    return this.props.code.unpack();
  }
  getValue(): DataFieldResponseValue {
    return this.props.value;
  }
  protected validate(props: Readonly<IDataFieldResponse>): void {
    if (Guard.isEmpty(props.value).succeeded) {
      throw new ArgumentNotProvidedException(
        "The value of data field response can't be empty.Please provide it."
      );
    }
  }
  static create(
    createProps: CreateDataFieldResponse
  ): Result<DataFieldResponse> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure) {
        return Result.fail(formatError(codeRes, DataFieldResponse.name));
      }

      return Result.ok(
        new DataFieldResponse({
          code: codeRes.val,
          value: createProps.value,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
