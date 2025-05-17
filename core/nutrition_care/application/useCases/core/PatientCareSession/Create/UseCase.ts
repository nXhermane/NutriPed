import { AggregateID, Factory, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { CreatePatientCareSessionRequest } from "./Request";
import { CreatePatientCareSessionResponse } from "./Response";
import {
   APPETITE_TEST_CODES,
   APPETITE_TEST_RESULT_CODES,
   AppetiteTestResult,
   CreatePatientCareSessionProps,
   NutritionCarePatientACL,
   PatientCareSession,
   PatientCareSessionRepository,
} from "../../../../../domain";

export class CreatePatientCareSessionUseCase implements UseCase<CreatePatientCareSessionRequest, CreatePatientCareSessionResponse> {
   constructor(
      private readonly patientCareSessionFactory: Factory<CreatePatientCareSessionProps, PatientCareSession>,
      private readonly repo: PatientCareSessionRepository,
      private readonly patientAcl: NutritionCarePatientACL,
   ) {}

   async execute(request: CreatePatientCareSessionRequest): Promise<CreatePatientCareSessionResponse> {
      try {
        // Verify if patient exist 
         const patientExist = await this.patientExist(request.patientId);
         if (!patientExist) {
            return left(Result.fail("PatientCareSession must be created for valid patient."));
         }
        // Create Patient Care Session 
         const patientCareSessionRes = await this.patientCareSessionFactory.create({
            patientId: request.patientId,
            appetiteTestResult: this.createNoneAppetiteTestResult(),
            clinicalEvent: [],
         });
         if (patientCareSessionRes.isFailure) return left(patientCareSessionRes);
         
         const patientCareSession = patientCareSessionRes.val;
         patientCareSession.created();
         await this.repo.save(patientCareSession);

         return right(Result.ok({ id: patientCareSession.id }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }

   private createNoneAppetiteTestResult() {
      return new AppetiteTestResult({ code: new SystemCode({ _value: APPETITE_TEST_CODES.CODE }), result: APPETITE_TEST_RESULT_CODES.NONE });
   }
   private async patientExist(patientId: AggregateID): Promise<boolean> {
      return !!(await this.patientAcl.getPatientInfo(patientId));
   }
}
