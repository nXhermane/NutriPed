import { handleError, left, Result, right, UseCase } from "@shared";
import { MakePatientCareSessionReadyRequest } from "./Request";
import { MakePatientCareSessionReadyResponse } from "./Response";
import { PatientCareSessionRepository, PatientCareSessionStatus } from "../../../../../domain";

export class MakePatientCareSessionReadyUseCase implements UseCase<MakePatientCareSessionReadyRequest, MakePatientCareSessionReadyResponse> {
   constructor(private readonly repo: PatientCareSessionRepository) {}
   async execute(request: MakePatientCareSessionReadyRequest): Promise<MakePatientCareSessionReadyResponse> {
      try {
         const patientCareSession = await this.repo.getByIdOrPatientId(request.patientIdOrPatientCareId);
         patientCareSession.changeStatus(PatientCareSessionStatus.IN_PROGRESS);
         await this.repo.save(patientCareSession);

         return right(Result.ok(true));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
