import { AggregateID } from "@shared";
import { UnitDto } from "../../../dtos";

export type UpdateUnitRequest = {
  id: AggregateID;
  data: Partial<Omit<UnitDto, "id" | "createdAt" | "updatedAt" | "code">>;
};
