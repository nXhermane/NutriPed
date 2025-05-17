import { AggregateID } from "@shared";
import { BiochemicalReferenceDto } from "../../../../dtos";

export type UpdateBiochemicalReferenceRequest = {
   id: AggregateID;
   data: Partial<Omit<BiochemicalReferenceDto, "id" | "code" | "createdAt" | "updatedAt">>;
};
