import { Patient } from "@core/patient";
import {
   Address,
   Birthday,
   Contact,
   DomainDate,
   formatError,
   FullName,
   Gender,
   InfraMapToDomainError,
   InfrastructureMapper,
   Result,
} from "@core/shared";
import { PatientPersistenceDto } from "../persistenceDto";

export class PatientInfraMapper implements InfrastructureMapper<Patient, PatientPersistenceDto> {
   toPersistence(entity: Patient): PatientPersistenceDto {
      return {
         id: entity.id as string,
         name: entity.getName(),
         birthday: entity.getBirthday(),
         gender: entity.getGender(),
         parents: entity.getParents(),
         contact: entity.getContact(),
         address: entity.getAddress(),
         registrationDate: entity.getRegistrationDate(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: PatientPersistenceDto): Patient {
      const fullnameRes = FullName.create(record.name);
      const motherRes = FullName.create(record.parents.mother || "mother");
      const fatherRes = FullName.create(record.parents.father || "father");
      const contactRes = Contact.create({ email: record.contact.email, phoneNumber: record.contact.tel });
      const addressRes = Address.create(record.address);
      const genderRes = Gender.create(record.gender);
      const birthdayRes = Birthday.create(record.birthday);
      const registrationDateRes = DomainDate.create(record.registrationDate);
      const combinedRes = Result.combine([contactRes, addressRes, genderRes, birthdayRes, registrationDateRes, fullnameRes, motherRes, fatherRes]);
      if (combinedRes.isFailure) throw new InfraMapToDomainError(formatError(combinedRes, PatientInfraMapper.name));
      return new Patient({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            name: fullnameRes.val,
            address: addressRes.val,
            contact: contactRes.val,
            birthday: birthdayRes.val,
            gender: genderRes.val,
            registrationDate: registrationDateRes.val,
            parents: {
               father: record.parents.father ? fatherRes.val : undefined,
               mother: record.parents.mother ? motherRes.val : undefined,
            },
         },
      });
   }
}
