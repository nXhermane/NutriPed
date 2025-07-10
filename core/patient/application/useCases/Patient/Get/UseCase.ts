import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetPatientRequest } from "./Request";
import { GetPatientResponse } from "./Response";
import { Patient, PatientRepository } from "../../../../domain";
import { PatientDto } from "../../../dtos";

export class GetPatientUseCase
  implements UseCase<GetPatientRequest, GetPatientResponse>
{
  constructor(
    private readonly repo: PatientRepository,
    private readonly mapper: ApplicationMapper<Patient, PatientDto>
  ) {}
  async execute(request: GetPatientRequest): Promise<GetPatientResponse> {
    try {
      const patients = [];
      if (request.id) patients.push(await this.repo.getById(request.id));
      else patients.push(...(await this.repo.getAll()));
      return right(Result.ok(patients.map(this.mapper.toResponse)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
