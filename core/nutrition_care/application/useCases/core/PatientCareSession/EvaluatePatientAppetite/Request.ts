import { AggregateID } from "@shared";
import { IAppetiteTestData } from "../../../../../domain";

export type EvaluatePatientAppetiteRequest = {
  patientCareOrPatientId: AggregateID;
  data: Omit<IAppetiteTestData, "patientWeight">;
};
