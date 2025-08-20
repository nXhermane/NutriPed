import { DATA_FIELD_CODE_TYPE, FieldDataType } from "@/core/constants";
import {
  ConditionResult,
  formatError,
  handleError,
  Result,
  UnitCode,
} from "@/core/shared";
import { DataFieldResponse } from "../models";
import {
  DataFieldReferenceRepository,
  INormalizeDataFieldResponseService,
} from "../ports";
import { UnitAcl } from "../../common";

export class NormalizeDataFieldResponseService
  implements INormalizeDataFieldResponseService
{
  constructor(
    private readonly dataFieldRepo: DataFieldReferenceRepository,
    private readonly unitAcl: UnitAcl
  ) {}
  async normalize(
    dataFieldResponses: DataFieldResponse[]
  ): Promise<Result<Record<DATA_FIELD_CODE_TYPE, number | string>>> {
    try {
      const normalizationResults = await Promise.all(
        dataFieldResponses.map(datafield =>
          this.normaliseDataFieldResponse(datafield)
        )
      );
      const combinedRes = Result.combine(normalizationResults);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, NormalizeDataFieldResponseService.name)
        );
      }
      return Result.ok(
        normalizationResults.reduce((acc: any, currentRes) => {
          acc[currentRes.val.code] = currentRes.val.value;
          return acc;
        }, {})
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async normaliseDataFieldResponse(
    dataFieldResponse: DataFieldResponse
  ): Promise<Result<{ code: DATA_FIELD_CODE_TYPE; value: string | number }>> {
    const ref = await this.dataFieldRepo.getByCode(
      dataFieldResponse.unpack().code
    );
    let normliazeValue = null;

    switch (ref.getType()) {
      case FieldDataType.INT:
      case FieldDataType.STR:
      case FieldDataType.ENUM:
      case FieldDataType.RANGE:
        {
          normliazeValue = dataFieldResponse.getValue() as number | string;
        }
        break;
      case FieldDataType.BOOL:
        {
          normliazeValue = dataFieldResponse.getValue()
            ? ConditionResult.True
            : ConditionResult.False;
        }
        break;
      case FieldDataType.QUANTITY:
        {
          const fieldValue = dataFieldResponse.getValue() as {
            unit: string;
            value: number;
          };
          const units = ref.getUnits();
          if (units?.default == fieldValue.unit) {
            normliazeValue = fieldValue.value;
          } else {
            const fromUnitCodeRes = UnitCode.create(fieldValue.unit);
            const toUnitCodeRes = UnitCode.create(units?.default as string);
            const combinedRes = Result.combine([
              fromUnitCodeRes,
              toUnitCodeRes,
            ]);
            if (combinedRes.isFailure) {
              return Result.fail(
                formatError(combinedRes, NormalizeDataFieldResponseService.name)
              );
            }
            const convertedValueRes = await this.unitAcl.convertTo(
              fromUnitCodeRes.val,
              toUnitCodeRes.val,
              fieldValue.value
            );
            if (convertedValueRes.isFailure) {
              return Result.fail(
                formatError(
                  convertedValueRes,
                  NormalizeDataFieldResponseService.name
                )
              );
            }
            normliazeValue = convertedValueRes.val;
          }
        }
        break;
      default:
        throw new Error(
          "Data field type is not supported on normliaze data field response service."
        );
    }
    return Result.ok({
      code: dataFieldResponse.getCode() as DATA_FIELD_CODE_TYPE,
      value: normliazeValue,
    });
  }
}
