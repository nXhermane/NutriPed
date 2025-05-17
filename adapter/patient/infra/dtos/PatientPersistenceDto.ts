import { EntityPersistenceDto } from "../../../shared";


export interface PatientPersistenceDto extends EntityPersistenceDto {
   name: string;
   gender: "M" | "F" | "O";
   birthday: string;
   parents: {
      mother?: string;
      father?: string;
   };
   contact: {
      email: string;
      tel: string;
   };
   address: {
      street?: string;
      city?: string;
      postalCode?: string;
      country: string;
   };
   registrationDate: string;
}
