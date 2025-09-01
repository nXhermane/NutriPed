import {
  ApplicationMapper,
  handleError,
  left,
  right,
  UseCase,
} from "@shared";
import { GetMedicineRequest } from "./Request";
import { GetMedicineResponse } from "./Response";
import {
  Medicine,
  MedicineRepository,
} from "../../../../../domain/modules/next/medicines/models";
import { MedicineDto } from "../../../../dtos/next/medicines/MedicineDto";
import { SystemCode } from "@/core/shared";

export class GetMedicineUseCase
  implements UseCase<GetMedicineRequest, GetMedicineResponse>
{
  constructor(
    private readonly repo: MedicineRepository,
    private readonly mapper: ApplicationMapper<Medicine, MedicineDto>
  ) {}
  async execute(request: GetMedicineRequest): Promise<GetMedicineResponse> {
    try {
      const medicines = await (request.code
        ? [await this.repo.getByCode(SystemCode.create(request.code).val)]
        : request.id
        ? [await this.repo.getById(request.id)]
        : await this.repo.getAll());

      return right(
        Result.ok(medicines.map(medicine => this.mapper.toResponse(medicine)))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
