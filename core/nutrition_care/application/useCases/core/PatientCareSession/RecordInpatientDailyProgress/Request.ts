import { MonitoringEntryType } from "@/core/nutrition_care/domain/core/models/valueObjects/MonitoringEntry";
import { ClinicalEventType } from "@/core/nutrition_care/domain/core/models/valueObjects/ClinicalEvent";

// Define a generic structure for an administered action
interface AdministeredAction {
  type: string; // e.g., 'milk', 'medicine'
  code: string; // e.g., 'F-75', 'amoxicillin'
  quantity: number;
  unit: string;
}

export interface RecordInpatientDailyProgressRequest {
  patientCareSessionId: string;
  date: string; // ISO date string

  monitoringEntries: {
    type: MonitoringEntryType;
    code: string;
    value: any;
    date: string;
  }[];

  clinicalEvents: {
    code: string;
    isPresent: boolean;
    type: ClinicalEventType;
  }[];

  administeredActions: AdministeredAction[];
}
