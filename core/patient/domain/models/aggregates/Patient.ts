import {
  Address,
  AggregateID,
  AggregateRoot,
  ArgumentOutOfRangeException,
  Birthday,
  Contact,
  DomainDate,
  EntityPropsBaseType,
  formatError,
  FullName,
  Gender,
  handleError,
  IAddress,
  Result,
  Sex,
  ValueType,
} from "@shared";
import { PATIENT_MAX_AGE_IN_YEAR } from "../constants";
import {
  PatientAgeOrGenderUpdatedEvent,
  PatientCreatedEvent,
  PatientDeletedEvent,
} from "../../events";

export interface IPatient extends EntityPropsBaseType {
  name: FullName;
  gender: Gender;
  birthday: Birthday;
  parents: {
    mother?: FullName;
    father?: FullName;
  };
  contact: Contact;
  address: Address;
  registrationDate: DomainDate;
}
export interface CreatePatientProps {
  name: string;
  gender: `${Sex}`;
  birthday: string;
  parents: {
    mother?: string;
    father?: string;
  };
  contact: {
    email: string;
    tel: string;
  };
  address: IAddress;
  registrationDate?: string;
}
export class Patient extends AggregateRoot<IPatient> {
  getName(): string {
    return this.props.name.toString();
  }
  getGender(): `${Sex}` {
    return this.props.gender.sex;
  }
  getBirthday(): string {
    return this.props.birthday.toString();
  }
  getParents(): { mother?: string; father?: string } {
    return {
      mother: this.props.parents.mother?.toString(),
      father: this.props.parents.father?.toString(),
    };
  }
  getContact(): { email: string; tel: string } {
    const { contact } = this.props;
    return {
      email: contact.email,
      tel: contact.phoneNumber,
    };
  }
  getAddress(): IAddress {
    return this.props.address.unpack();
  }
  getRegistrationDate(): string {
    return this.props.registrationDate.toString();
  }
  changeName(fullName: FullName) {
    this.props.name = fullName;
    this.validate();
  }
  changeBirthday(birthday: Birthday) {
    this.props.birthday = birthday;
    this.validate();
    this.addDomainEvent(
      new PatientAgeOrGenderUpdatedEvent({
        id: this.id,
        birthday: this.getBirthday(),
        sex: this.getGender(),
      })
    );
  }
  changeGender(gender: Gender) {
    this.props.gender = gender;
    this.validate();
    this.addDomainEvent(
      new PatientAgeOrGenderUpdatedEvent({
        id: this.id,
        birthday: this.getBirthday(),
        sex: this.getGender(),
      })
    );
  }
  changeParents(parents: { mother?: FullName; father?: FullName }) {
    if (parents.mother) this.props.parents.mother = parents.mother;
    if (parents.father) this.props.parents.father = parents.father;
    this.validate();
  }
  changeContact(contact: Contact) {
    this.props.contact = contact;
    this.validate();
  }
  changeAddress(address: Address) {
    this.props.address = address;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    // Validation code here
    if (this.props.birthday.getAge() > PATIENT_MAX_AGE_IN_YEAR) {
      throw new ArgumentOutOfRangeException(
        `The age in pediatric must be undo ${PATIENT_MAX_AGE_IN_YEAR}`
      );
    }
    this._isValid = true;
  }
  override created(): void {
    this.addDomainEvent(
      new PatientCreatedEvent({
        id: this.id,
        sex: this.getGender(),
        birthday: this.getBirthday(),
      })
    );
  }
  override delete(): void {
    this.addDomainEvent(new PatientDeletedEvent({ id: this.id }));
    super.delete();
  }
  static create(
    createProps: CreatePatientProps,
    id: AggregateID
  ): Result<Patient> {
    try {
      const nameRes = FullName.create(createProps.name);
      const genderRes = Gender.create(createProps.gender);
      const birthdayRes = Birthday.create(createProps.birthday);
      const parentsRes = {
        mother: createProps.parents.mother
          ? FullName.create(createProps.parents.mother)
          : Result.ok(),
        father: createProps.parents.father
          ? FullName.create(createProps.parents.father)
          : Result.ok(),
      };
      const contactRes = Contact.create({
        email: createProps.contact.email,
        phoneNumber: createProps.contact.tel,
      });
      const addressRes = Address.create(createProps.address);
      const registrationDate = new DomainDate();
      const combinedRes = Result.combine([
        nameRes,
        genderRes,
        birthdayRes,
        contactRes,
        addressRes,
        ...(Object.values(parentsRes) as Result<ValueType>[]),
      ]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, Patient.name));
      return Result.ok(
        new Patient({
          id,
          props: {
            name: nameRes.val,
            gender: genderRes.val,
            birthday: birthdayRes.val,
            contact: contactRes.val,
            address: addressRes.val,
            parents: {
              mother: parentsRes.mother.val as FullName | undefined,
              father: parentsRes.father.val as FullName | undefined,
            },
            registrationDate,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
