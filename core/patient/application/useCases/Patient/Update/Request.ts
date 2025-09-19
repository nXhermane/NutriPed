import { AggregateID } from "@shared";
import { PatientDto } from "../../../dtos";

export type UpdatePatientRequest = {
  id: AggregateID;
  data: Partial<
    Omit<PatientDto, "id" | "updatedAt" | "createdAt" | "registrationDate">
  >;
};
