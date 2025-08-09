import { EdemaType } from "@/core/nutrition_care/domain/modules/complication/models/Edema";
import { AppetiteTestResultStatus } from "@/core/nutrition_care/domain/modules/appetiteTest/models/AppetiteTestResult";

export interface AdmitPatientToCNTRequest {
  patientId: string;
  weight: number;
  height: number;
  muac?: number;
  edema: EdemaType;
  appetiteTestResult: AppetiteTestResultStatus;
  complications: string[]; // Array of complication codes
  caregiverChoice: boolean;
}
