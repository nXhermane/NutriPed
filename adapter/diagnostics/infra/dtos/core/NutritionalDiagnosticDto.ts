import { EntityPersistenceDto } from "../../../../shared";
import { NutritionalAssessmentResultPersistenceDto } from "./NutritionalAssessmentResultDto";
import { PatientDiagnosticDataPersistenceDto } from "./PatientDiagnosticDataDto";

export interface NutritionalDiagnosticPersistenceDto extends EntityPersistenceDto {
   patientId: string;
   patientData: PatientDiagnosticDataPersistenceDto;
   result?: NutritionalAssessmentResultPersistenceDto;
   date: string;
   notes: string[];
   atInit: boolean;
   modificationHistories: {
      prevResult: NutritionalAssessmentResultPersistenceDto;
      nextResult: NutritionalAssessmentResultPersistenceDto;
      date: string;
      reason: string;
   }[];
}
