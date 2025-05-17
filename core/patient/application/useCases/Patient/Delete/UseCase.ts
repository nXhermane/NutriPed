import { handleError, left, Result, right, UseCase } from "@shared";
import { DeletePatientRequest } from "./Request";
import { DeletePatientResponse } from "./Response";
import { PatientRepository } from "../../../../domain";

export class DeletePatientUseCase implements UseCase<DeletePatientRequest, DeletePatientResponse> {
   constructor(private readonly repo: PatientRepository) {}
   async execute(request: DeletePatientRequest): Promise<DeletePatientResponse> {
      try {
         const patient = await this.repo.getById(request.id);
         patient.delete();
         await this.repo.remove(patient);
         return right(Result.ok());
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
