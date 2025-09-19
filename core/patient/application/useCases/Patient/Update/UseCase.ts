import {
  Address,
  Birthday,
  Contact,
  FullName,
  Gender,
  handleError,
  left,
  Result,
  right,
  UseCase,
  ValueType,
} from "@shared";
import { UpdatePatientRequest } from "./Request";
import { UpdatePatientResponse } from "./Response";
import { Patient, PatientRepository } from "../../../../domain";

export class UpdatePatientUseCase
  implements UseCase<UpdatePatientRequest, UpdatePatientResponse>
{
  constructor(private readonly repo: PatientRepository) {}
  async execute(request: UpdatePatientRequest): Promise<UpdatePatientResponse> {
    try {
      const patient = await this.repo.getById(request.id);
      const updatedPatientRes = this.updatePatient(patient, request.data);
      if (updatedPatientRes.isFailure) return left(updatedPatientRes);
      await this.repo.save(patient);
      return right(Result.ok());
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private updatePatient(
    patient: Patient,
    data: UpdatePatientRequest["data"]
  ): Result<ValueType> {
    try {
      if (data.name) {
        const fullname = FullName.create(data.name);
        if (fullname.isFailure) return fullname;
        patient.changeName(fullname.val);
      }
      if (data.birthday) {
        const birthday = Birthday.create(data.birthday);
        if (birthday.isFailure) return birthday;
        patient.changeBirthday(birthday.val);
      }
      if (data.gender) {
        const gender = Gender.create(data.gender);
        if (gender.isFailure) return gender;
        patient.changeGender(gender.val);
      }
      if (data.address) {
        const address = Address.create(data.address);
        if (address.isFailure) return address;
        patient.changeAddress(address.val);
      }
      if (data.parents?.mother) {
        const mother = FullName.create(data.parents.mother);
        if (mother.isFailure) return mother;
        patient.changeParents({ mother: mother.val });
      }
      if (data.parents?.father) {
        const father = FullName.create(data.parents.father);
        if (father.isFailure) return father;
        patient.changeParents({ father: father.val });
      }
      if (data.contact) {
        const contact = Contact.create({
          email: data.contact.email,
          phoneNumber: data.contact.tel,
        });
        if (contact.isFailure) return contact;
        patient.changeContact(contact.val);
      }
      return Result.ok();
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
