import { handleError, left, Result, right, UseCase } from "@/core/shared";
import { GetNormalizedAnthropometricDataRequest } from "./Request";
import { GetNormalizedAnthropometricDataResponse } from "./Response";
import {
  INormalizeAnthropometricDataACL,
  MedicalRecordRepository,
} from "./../../../../domain";

export class GetNormalizedAnthropometricDataUseCase
  implements
    UseCase<
      GetNormalizedAnthropometricDataRequest,
      GetNormalizedAnthropometricDataResponse
    >
{
  constructor(
    private readonly medicalRecordRepo: MedicalRecordRepository,
    private readonly normalizeAnthropDataACL: INormalizeAnthropometricDataACL
  ) {}

  async execute(
    request: GetNormalizedAnthropometricDataRequest
  ): Promise<GetNormalizedAnthropometricDataResponse> {
    try {
      const medicalRecord = await this.medicalRecordRepo.getByPatientIdOrID(
        request.patientOrMedicalRecordId
      );
      const anthropometricRecords = medicalRecord.getProps().anthropometricData;
      const normalizeAnthropometricRecordRes = await Promise.all(
        anthropometricRecords.map(record =>
          this.normalizeAnthropDataACL.normalize(record)
        )
      );
      const combinedRes = Result.combine(normalizeAnthropometricRecordRes);
      if (combinedRes.isFailure) return left(combinedRes);
      return right(
        Result.ok(
          normalizeAnthropometricRecordRes.map(res => {
            const val = res.val;
            return {
              code: val.getCode(),
              context: val.getContext(),
              id: val.id,
              recordedAt: val.getRecordDate(),
              ...val.getMeasurement(),
            };
          })
        )
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
