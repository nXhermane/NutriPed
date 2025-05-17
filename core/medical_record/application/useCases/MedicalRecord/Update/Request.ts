import { MedicalRecordDto } from "./../../../dtos";
import { AggregateID } from "@shared";

export type UpdateMedicalRecordRequest = {
   medicalRecordId: AggregateID;
   data: Partial<Omit<MedicalRecordDto, "id" | "patientId">>;
};
