import { formatError, Guard, handleError, Result } from "@/core/shared";
import { DataFieldResponse, DataFieldReference } from "../models";
import {
  DataFieldReferenceRepository,
  IDataFieldValidatationService,
} from "../ports";
import { DATA_FIELD_ERROS, handleDataFieldError } from "../errors";
import { FieldDataType } from "@/core/constants";

export class DataFieldValidationService
  implements IDataFieldValidatationService
{
  constructor(private readonly repo: DataFieldReferenceRepository) {}
  async validate(data: DataFieldResponse[]): Promise<Result<void>> {
    const dataFieldReferences: DataFieldReference[] =
      await this.getAllFieldsReferences();
    const validationResults = data.map(field =>
      this.validateDataFieldResponse(field, dataFieldReferences)
    );
    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      return Result.fail(
        formatError(combinedResult, DataFieldValidationService.name)
      );
    }
    return Result.ok(void 0);
  }

  private validateDataFieldResponse(
    data: DataFieldResponse,
    dataFieldRefs: DataFieldReference[]
  ): Result<boolean> {
    try {
      const findedRefs = dataFieldRefs.find(
        field => field.getCode() == data.getCode()
      );
      if (!findedRefs) {
        return handleDataFieldError(
          DATA_FIELD_ERROS.VALIDATION.NOT_FOUND.path,
          `DataFieldCode: ${data.getCode()}`
        );
      }
      let validationResult: boolean = false;
      switch (findedRefs.getType()) {
        case FieldDataType.BOOL:
          validationResult = typeof data.getValue() == "boolean";
          break;

        case FieldDataType.INT:
          validationResult = typeof data.getValue() == "number";
          break;
        case FieldDataType.STR:
          validationResult = typeof data.getValue() == "string";
          break;
        case FieldDataType.RANGE:
          {
            const isNumber = Guard.isNumber(data.getValue()).succeeded;
            const inRange = Guard.inRange(
              data.getValue() as number,
              findedRefs.getRange()?.[0] as number,
              findedRefs.getRange()?.[1] as number,
              "dataField"
            ).succeeded;
            validationResult = isNumber && inRange;
          }
          break;
        case FieldDataType.ENUM:
          {
            const value = data.getValue();
            const enumValues = findedRefs.getEnum()!;
            validationResult = !!enumValues.find(
              enumItem => enumItem.value == value
            );
          }
          break;
        case FieldDataType.QUANTITY:
          {
            const dataValue: any = data.getValue();
            const isQuantityValue =
              typeof dataValue == "object" &&
              "data" in dataValue &&
              "unit" in dataValue;
            const haveValidUnit = findedRefs
              .getUnits()!
              .available.find(unit => unit == dataValue.unit);
            validationResult = isQuantityValue && !!haveValidUnit;
          }
          break;
        default:
          throw new Error("This data type is not supported.");
      }
      if (!validationResult) {
        return handleDataFieldError(
          DATA_FIELD_ERROS.VALIDATION.INVALID_DATA_FIELD.path,
          `[DataFieldCode]: ${data.getCode()}`
        );
      }
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private async getAllFieldsReferences(): Promise<DataFieldReference[]> {
    return this.repo.getAll();
  }
}
