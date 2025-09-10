import {
  Patient,
  CreatePatientProps,
} from "@patient/domain/models/aggregates/Patient";
import {
  AggregateID,
  Birthday,
  FullName,
  Gender,
  Sex,
  Contact,
  Address,
} from "@shared";
import { mock, MockProxy } from "jest-mock-extended";

describe("Patient", () => {
  let createPatientProps: CreatePatientProps;
  let mockId: MockProxy<AggregateID>;

  beforeEach(() => {
    const validBirthday = new Date();
    validBirthday.setFullYear(validBirthday.getFullYear() - 5);

    createPatientProps = {
      name: "John Doe",
      gender: "M",
      birthday: validBirthday.toISOString().split("T")[0],
      parents: {
        mother: "Jane Doe",
        father: "Jack Doe",
      },
      contact: {
        email: "john.doe@example.com",
        tel: "1234567890",
      },
      address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA",
        postalCode: "12345",
      },
    };
    mockId = mock<AggregateID>();
  });

  const createValidPatient = (): Patient => {
    const patientResult = Patient.create(createPatientProps, mockId);
    if (patientResult.isFailure) {
      throw new Error(
        `Failed to create a valid patient for testing: ${patientResult.err}`
      );
    }
    return patientResult.val;
  };

  describe("create", () => {
    it("should create a new patient with valid props", () => {
      const patientResult = Patient.create(createPatientProps, mockId);

      expect(patientResult.isSuccess).toBe(true);
      const patient = patientResult.val;
      expect(patient).toBeInstanceOf(Patient);
      expect(patient.getName()).toBe("John Doe");
      expect(patient.getGender()).toBe("M");
      expect(patient.getBirthday()).toBe(createPatientProps.birthday);
    });

    it("should fail to create a patient with an invalid name", () => {
      createPatientProps.name = "";
      const patientResult = Patient.create(createPatientProps, mockId);
      expect(patientResult.isFailure).toBe(true);
    });

    it("should fail to create a patient with an invalid gender", () => {
      createPatientProps.gender = "X" as `${Sex}`;
      const patientResult = Patient.create(createPatientProps, mockId);
      expect(patientResult.isFailure).toBe(true);
    });

    it("should fail to create a patient with an invalid birthday", () => {
      createPatientProps.birthday = "invalid-date";
      const patientResult = Patient.create(createPatientProps, mockId);
      expect(patientResult.isFailure).toBe(true);
    });

    it("should fail to create a patient with an age greater than the maximum allowed", () => {
      const invalidBirthday = new Date();
      invalidBirthday.setFullYear(invalidBirthday.getFullYear() - 20);
      createPatientProps.birthday = invalidBirthday.toISOString().split("T")[0];

      const patientResult = Patient.create(createPatientProps, mockId);
      expect(patientResult.isFailure).toBe(true);
    });

    it("should fail to create a patient with invalid contact info", () => {
      createPatientProps.contact.email = "invalid-email";
      const patientResult = Patient.create(createPatientProps, mockId);
      expect(patientResult.isFailure).toBe(true);
    });
  });

  describe("entity methods", () => {
    it("should change the patient name", () => {
      const patient = createValidPatient();
      const newName = FullName.create("Jane Doe").val;
      patient.changeName(newName);
      expect(patient.getName()).toBe("Jane Doe");
    });

    it("should change the patient birthday", () => {
      const patient = createValidPatient();
      const newBirthdayDate = new Date();
      newBirthdayDate.setFullYear(newBirthdayDate.getFullYear() - 6);
      const newBirthday = Birthday.create(
        newBirthdayDate.toISOString().split("T")[0]
      ).val;
      patient.changeBirthday(newBirthday);
      expect(patient.getBirthday()).toBe(
        newBirthdayDate.toISOString().split("T")[0]
      );
    });

    it("should throw an error when changing to a birthday that exceeds the max age", () => {
      const patient = createValidPatient();
      const invalidBirthday = new Date();
      invalidBirthday.setFullYear(invalidBirthday.getFullYear() - 20);
      const newBirthday = Birthday.create(
        invalidBirthday.toISOString().split("T")[0]
      ).val;
      expect(() => patient.changeBirthday(newBirthday)).toThrow();
    });

    it("should change the patient gender", () => {
      const patient = createValidPatient();
      const newGender = Gender.create("F").val;
      patient.changeGender(newGender);
      expect(patient.getGender()).toBe("F");
    });

    it("should change the patient parents", () => {
      const patient = createValidPatient();
      const newParents = {
        mother: FullName.create("New Mother").val,
        father: FullName.create("New Father").val,
      };
      patient.changeParents(newParents);
      expect(patient.getParents()).toEqual({
        mother: "New Mother",
        father: "New Father",
      });
    });

    it("should change the patient contact", () => {
      const patient = createValidPatient();
      const newContact = Contact.create({
        email: "new.email@example.com",
        phoneNumber: "0987654321",
      }).val;
      patient.changeContact(newContact);
      expect(patient.getContact()).toEqual({
        email: "new.email@example.com",
        tel: "0987654321",
      });
    });

    it("should change the patient address", () => {
      const patient = createValidPatient();
      const newAddress = Address.create({
        street: "456 New St",
        city: "Newtown",
        country: "USA",
        postalCode: "54321",
      }).val;
      patient.changeAddress(newAddress);
      expect(patient.getAddress()).toEqual({
        street: "456 New St",
        city: "Newtown",
        country: "USA",
        postalCode: "54321",
      });
    });
  });
});
