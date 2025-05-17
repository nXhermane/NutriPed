import { EntityPersistenceDto } from "../../../common";
import { PatientDiagnosticDataPersistenceDto } from "./PatientDiagnosticDataDto";
import { NutritionalAssessmentResultPersistenceDto } from "./NutritionalAssessmentResultDto";

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
