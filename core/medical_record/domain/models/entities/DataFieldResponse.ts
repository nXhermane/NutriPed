import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import {
  AggregateID,
  ArgumentNotProvidedException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";

export type DataFieldResponseValue =
  | boolean
  | number
  | string
  | { unit: string; value: number };
export interface IDataFieldResponse extends EntityPropsBaseType {
  code: SystemCode<DATA_FIELD_CODE_TYPE>;
  data: DataFieldResponseValue;
  recordAt: DomainDateTime;
}

export interface CreateDataFieldResponse {
  code: DATA_FIELD_CODE_TYPE;
  data: DataFieldResponseValue;
  recordAt?: string;
}

export class DataFieldResponse extends Entity<IDataFieldResponse> {
  getCode() {
    return this.props.code.unpack();
  }
  getData() {
    return this.props.data;
  }
  getRecordAt() {
    return this.props.recordAt.unpack();
  }
  changeData(data: DataFieldResponseValue) {
    this.props.data = data;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.data).succeeded) {
      throw new ArgumentNotProvidedException(
        "The data of data field response can't be empty."
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateDataFieldResponse,
    id: AggregateID
  ): Result<DataFieldResponse> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const recordedAtRes = createProps.recordAt
        ? DomainDateTime.create(createProps.recordAt)
        : DomainDateTime.create();
      const combinedRes = Result.combine([codeRes, recordedAtRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DataFieldResponse.name));
      }
      return Result.ok(
        new DataFieldResponse({
          id,
          props: {
            code: codeRes.val,
            data: createProps.data,
            recordAt: recordedAtRes.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
