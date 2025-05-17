import { AggregateID } from "@shared";
import { AnthropometricMeasureDto } from "../../../../dtos";

export type UpdateAnthropometricMeasureRequest = {
   id: AggregateID;
   data: Partial<Omit<AnthropometricMeasureDto, "id" | "code"|"createdAt" | "updatedAt">>;
};
