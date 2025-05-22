import { handleError, left, Result, right, UseCase } from "@shared";
import { GetMedicineDosageRequest } from "./Request";
import { GetMedicineDosageResponse } from "./Response";
import { IMedicineDosageService, MedicineRepository } from "../../../../domain";
import { AnthroSystemCodes } from "../../../../../constants";

export class GetMedicineDosageUseCase
  implements UseCase<GetMedicineDosageRequest, GetMedicineDosageResponse>
{
  constructor(
    private readonly medicineRepo: MedicineRepository,
    private readonly medicineDosageService: IMedicineDosageService
  ) {}
  async execute(
    request: GetMedicineDosageRequest
  ): Promise<GetMedicineDosageResponse> {
    try {
      const medicine = await this.medicineRepo.getById(request.medicineId);

      const medicineDosageRes = this.medicineDosageService.generateDosage(
        medicine,
        { [AnthroSystemCodes.WEIGHT]: request.patientWeightInKg }
      );
      if (medicineDosageRes.isFailure) return left(medicineDosageRes);

      const { code, weightRangeDosage, ...otherProps } =
        medicineDosageRes.val.unpack();
      return right(
        Result.ok({
          code: code.unpack(),
          weightRangeDosage: weightRangeDosage.unpack(),
          ...otherProps,
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
