import { ApplicationMapper } from "@shared";
import { Patient } from "../../domain";
import { PatientDto } from "../dtos";

export class PatientMapper implements ApplicationMapper<Patient, PatientDto> {
  toResponse(entity: Patient): PatientDto {
    return {
      id: entity.id,
      name: entity.getName(),
      gender: entity.getGender(),
      birthday: entity.getBirthday(),
      address: entity.getAddress(),
      contact: entity.getContact(),
      parents: entity.getParents(),
      registrationDate: entity.getRegistrationDate(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
