import { AggregateID } from "@/core/shared";

export type MakeClinicalSignDataInterpretationRequest = {
  patientId: AggregateID;
  signs: { code: string; data: object }[];
};
