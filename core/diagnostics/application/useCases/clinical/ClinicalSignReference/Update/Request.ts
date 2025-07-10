import { AggregateID } from "@shared";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export type UpdateClinicalSignReferenceRequest = {
  id: AggregateID;
  data: Partial<
    Omit<ClinicalSignReferenceDto, "id" | "createdAt" | "updatedAt" | "code">
  >;
};
