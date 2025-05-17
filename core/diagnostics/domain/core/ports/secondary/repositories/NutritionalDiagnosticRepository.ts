import { AggregateID, Repository } from "@shared";
import { NutritionalDiagnostic } from "../../../models";

export interface NutritionalDiagnosticRepository extends Repository<NutritionalDiagnostic> {
   getByPatient(patientId: AggregateID): Promise<NutritionalDiagnostic>;
   remove(diagnostic: NutritionalDiagnostic): Promise<void>;
}
