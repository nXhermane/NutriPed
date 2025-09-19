import { AggregateID, Repository } from "@shared";
import { NutritionalDiagnostic } from "../../../models";

export interface NutritionalDiagnosticRepository
  extends Repository<NutritionalDiagnostic> {
  getByIdOrPatientId(
    patientIdOrId: AggregateID
  ): Promise<NutritionalDiagnostic>;
  remove(diagnostic: NutritionalDiagnostic): Promise<void>;
}
