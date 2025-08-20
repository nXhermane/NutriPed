import { ClinicalData } from "../../../../clinical";
import { AnthropometricData } from "../../../../anthropometry";
import { BiologicalTestResult } from "../../../../biological";
import { AggregateID, Result } from "@/core/shared";

export interface PatientData {
  anthroData: { code: string; value: number; unit: string }[];
  clinicalData: {
    code: string;
    isPresent: boolean;
    data: Record<string, any>;
  }[];
  biologicalData: { code: string; value: number; unit: string }[];
}

export interface MedicalRecordACL {
  getPatientData(data: {
    patientId: AggregateID;
  }): Promise<Result<PatientData>>;
}
