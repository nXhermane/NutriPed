import { AggregateID, IAddress, Sex } from "@shared";

export interface PatientDto {
  id: AggregateID;
  name: string;
  gender: `${Sex}`;
  birthday: string;
  contact: { email: string; tel: string };
  address: IAddress;
  registrationDate: string;
  parents: { mother?: string; father?: string };
  updatedAt: string;
  createdAt: string;
}
