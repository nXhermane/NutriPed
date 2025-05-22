import { AggregateID, ICondition } from "@shared";
import { CreateAdmissionType } from "../../../domain";

export interface OrientationRefDto {
  id: AggregateID;
  name: string;
  code: string;
  admissionCriteria: ICondition[];
  admissionTypes: CreateAdmissionType[];
  updatedAt: string;
  createdAt: string;
}
