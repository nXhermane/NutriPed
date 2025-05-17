import { AggregateID } from "@shared";
import { CreatePropsDto, NutritionalAssessmentResultDto } from "../../../../dtos";

export type CorrectDiagnosticResultRequest = {
   nutritionalDiagnosticId: AggregateID;
   nutritionalAssessmentResultData: CreatePropsDto<NutritionalAssessmentResultDto>;
   reason: string 
};
