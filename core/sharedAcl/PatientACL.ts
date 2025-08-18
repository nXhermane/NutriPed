import { PatientACL, PatientInfo } from "../evaluation";
import { IPatientService, GetPatientRequest } from "./../patient";
import { AggregateID, Birthday, Gender, handleError, Result, Sex } from "@shared";

export class PatientACLImpl implements PatientACL {
  constructor(private readonly patientService: IPatientService) { }

  async getPatientInfo(patientID: AggregateID): Promise<Result<PatientInfo | null>> {
    try {
      const request: GetPatientRequest = {
        id: patientID,
      };

      const response = await this.patientService.get(request);

      if ("data" in response) {
        if (response.data.length === 0) return Result.ok(null)
        const patient = response.data[0];

        // Mapping vers le format PatientInfo attendu par le contexte consommateur
        return Result.ok({
          id: patient.id,
          gender: new Gender(patient.gender as Sex),
          birthday: new Birthday(patient.birthday)
        })
      } else {
        const _errorContent = JSON.parse(response.content)
        return Result.fail(_errorContent)
      }
    } catch (error) {
      return handleError(error) as Result<null>;
    }
  }
}
