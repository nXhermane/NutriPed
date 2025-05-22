import { AggregateID } from "@shared";
import { MedicalRecordDto } from "./../../../dtos";

export type AddDataToMedicalRecordRequest = {
  medicalRecordId: AggregateID;
  data: Partial<Omit<MedicalRecordDto, "id" | "patientId">>;
};
