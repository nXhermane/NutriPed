/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLINICAL_SIGNS } from "@core/constants";
import {
  ArgumentOutOfRangeException,
  DomainDate,
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";

export interface IClinicalSignData {
  code: SystemCode;
  data: { [key: string]: any };
  recordedAt: DomainDate;
}

export interface CreateClinicalSignData {
  code: string;
  data: {
    [key: string]: any;
  };
  recordedAt?: string;
}

export class ClinicalSignData extends ValueObject<IClinicalSignData> {
  protected validate(props: Readonly<IClinicalSignData>): void {
    if (!Object.values(CLINICAL_SIGNS).includes(props.code.unpack() as any)) {
      throw new ArgumentOutOfRangeException(
        "The clinical Sign is not supported."
      );
    }
  }
  static create(createProps: CreateClinicalSignData): Result<ClinicalSignData> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const recordedAt = createProps.recordedAt
        ? DomainDate.create(createProps.recordedAt)
        : DomainDate.create();
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, ClinicalSignData.name));
      return Result.ok(
        new ClinicalSignData({
          code: codeRes.val,
          data: createProps.data,
          recordedAt: recordedAt.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
