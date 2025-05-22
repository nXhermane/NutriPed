import { CreatePropsDto } from "@shared";
import { PatientDto } from "../../../dtos";

export type CreatePatientRequest = CreatePropsDto<
  Omit<PatientDto, "registrationDate">
>;
