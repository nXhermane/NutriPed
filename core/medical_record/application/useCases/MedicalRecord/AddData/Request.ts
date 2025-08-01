import { AggregateID } from "@shared";
import { MedicalRecordDto } from "./../../../dtos";
import { CreateClinicalSignData } from "@/core/medical_record/domain";

export type AddDataToMedicalRecordRequest = {
  medicalRecordId: AggregateID;
  data: Partial<
    Omit<MedicalRecordDto, "id" | "patientId" | "updatedAt" | "createdAt" | "clinicalData"> & {
      clinicalData: (Omit<CreateClinicalSignData, 'isPresent'> & { recordedAt: string })[];
    }
  >;
};
