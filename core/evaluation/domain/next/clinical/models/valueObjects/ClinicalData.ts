import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { DataFieldResponseValue } from "./../../../../data_fields";
import {
  ArgumentNotProvidedException,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export interface IClinicalData {
  code: SystemCode;
  data: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>;
}

export interface CreateClinicalData {
  code: string;
  data: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>;
}

export class ClinicalData extends ValueObject<IClinicalData> {
  getCode(): string {
    return this.props.code.unpack();
  }
  getData(): Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue> {
    return this.props.data;
  }

  protected validate(props: Readonly<IClinicalData>): void {
    if (Guard.isEmpty(props.data).succeeded) {
      throw new ArgumentNotProvidedException(
        "The data of clinical data can't be not found."
      );
    }
  }
  static create(createProps: CreateClinicalData): Result<ClinicalData> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure) {
        return Result.fail(formatError(codeRes, ClinicalData.name));
      }
      return Result.ok(
        new ClinicalData({ code: codeRes.val, data: createProps.data })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
