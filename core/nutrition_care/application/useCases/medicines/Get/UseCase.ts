import { ApplicationMapper, Guard, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { Medicine, MedicineRepository } from "../../../../domain";
import { GetMedicineRequest } from "./Request";
import { GetMedicineResponse } from "./Response";
import { MedicineDto } from "../../../dtos";

export class GetMedicineUseCase implements UseCase<GetMedicineRequest, GetMedicineResponse> {
   constructor(private readonly repo: MedicineRepository, private readonly mapper: ApplicationMapper<Medicine, MedicineDto>) {}
   async execute(request: GetMedicineRequest): Promise<GetMedicineResponse> {
      try {
         const medicines: Medicine[] = [];

         if (request.medicineId && !request.medicineCode) {
            const medicine = await this.repo.getById(request.medicineId);
            medicines.push(medicine);
         } else if (request.medicineCode && !request.medicineId) {
            const codeRes = SystemCode.create(request.medicineCode);
            if (codeRes.isFailure) return left(codeRes);
            const medicine = await this.repo.getByCode(codeRes.val);
            medicines.push(medicine);
         } else {
            const allMedicines = await this.repo.getAll();
            medicines.push(...allMedicines);
         }

         if (Guard.isEmpty(medicines).succeeded) {
            return left(Result.fail("Medicine not found."));
         }

         return right(Result.ok(medicines.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
