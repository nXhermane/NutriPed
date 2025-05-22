import { PatientACL, PatientInfo } from "./../diagnostics";
import { IPatientService, GetPatientRequest } from "./../patient";
import { AggregateID, Birthday, Gender, Sex } from "@shared";

export class PatientACLImpl implements PatientACL {
  constructor(private readonly patientService: IPatientService) {}

  async getPatientInfo(patientID: AggregateID): Promise<PatientInfo | null> {
    try {
      const request: GetPatientRequest = {
        id: patientID,
      };

      const response = await this.patientService.get(request);

      if ("data" in response && response.data.length > 0) {
        const patient = response.data[0];

        // Mapping vers le format PatientInfo attendu par le contexte consommateur
        return {
          id: patient.id,
          gender: new Gender(patient.gender as Sex),
          birthday: new Birthday(patient.birthday),
          // age: this.calculateAge(patient.birthday),
        };
      }

      return null;
    } catch (error) {
      return h;
    }
  }

  private calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
