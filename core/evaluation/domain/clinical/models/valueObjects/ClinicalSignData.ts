import { ClinicalDataType } from "@/core/constants";
import {
  ArgumentNotProvidedException,
  EmptyStringError,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  UnitCode,
  ValueObject,
} from "@shared";

export interface IClinicalSignData {
  name: string;
  code: SystemCode;
  question: string;
  dataType: ClinicalDataType;
  required: boolean;
  dataRange?: [number, number];
  enumValue?: { label: string; value: string }[];
  units?: { default: UnitCode; available: UnitCode[] };
}

export interface CreateClinicalSignData {
  name: string;
  code: string;
  question: string;
  dataType: ClinicalDataType;
  required: boolean;
  dataRange?: [number, number];
  enumValue?: { label: string; value: string }[];
  units?: { default: string; available: string[] };
}

export class ClinicalSignData extends ValueObject<IClinicalSignData> {
  protected validate(props: Readonly<IClinicalSignData>): void {
    if (Guard.isEmpty(props.name).succeeded)
      throw new EmptyStringError(
        "The name of ClinicalSignData can't be empty."
      );
    if (Guard.isEmpty(props.question).succeeded)
      throw new EmptyStringError(
        "The question linked to ClinicalSignData can't be empty."
      );
    if (props.dataType == ClinicalDataType.RANGE && !props.dataRange) {
      throw new ArgumentNotProvidedException(
        "When data type of ClinicalSignData is Range, the dataRange must be provided. Please provide dataRange and retry."
      );
    }
    if (props.dataType === ClinicalDataType.ENUM && !props.enumValue) {
      throw new ArgumentNotProvidedException(
        "When data type of clinicalSignData is enum the enumValue must be provided. Please  provide enumValue property and retry."
      );
    }
    if (props.dataType === ClinicalDataType.QUANTITY && !props.units) {
      throw new ArgumentNotProvidedException(
        "When data type of clinicalSignData is quantity the units must be provided. Please provide units property and retry."
      );
    }
  }
  static create(createProps: CreateClinicalSignData): Result<ClinicalSignData> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, ClinicalSignData.name));
      let processedProps: IClinicalSignData = {
        code: codeRes.val,
        name: createProps.name,
        question: createProps.question,
        dataType: createProps.dataType,
        dataRange: createProps.dataRange,
        required: createProps.required,
        enumValue: createProps.enumValue,
      };
      if (createProps.units) {
        const defaultRes = UnitCode.create(createProps.units.default);
        const availableRes = createProps.units.available.map(unit =>
          UnitCode.create(unit)
        );
        const combinedRes = Result.combine(availableRes.concat(defaultRes));
        if (combinedRes.isFailure)
          return Result.fail(formatError(combinedRes, ClinicalSignData.name));
        processedProps["units"] = {
          available: availableRes.map(res => res.val),
          default: defaultRes.val,
        };
      }
      return Result.ok(
        new ClinicalSignData({
          ...processedProps,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
