import {
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
} from "@core/diagnostics";
import { EntityBaseRepositoryExpo } from "../../../../shared";
import { NutritionalDiagnosticPersistenceDto } from "../..";
import { nutritional_diagnostics } from "../db";
import { AggregateID } from "@shared";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";

export class NutritionalDiagnosticRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    NutritionalDiagnostic,
    NutritionalDiagnosticPersistenceDto,
    typeof nutritional_diagnostics
  >
  implements NutritionalDiagnosticRepository
{
  override async getAll(): Promise<NutritionalDiagnostic[]> {
    throw new Error("Not Usable");
  }
  override async getById(id: AggregateID): Promise<NutritionalDiagnostic> {}
  override async save(
    entity: NutritionalDiagnostic,
    trx?: SQLiteTransaction<any, any, any, any>
  ): Promise<void> {}

  getByPatient(patientId: AggregateID): Promise<NutritionalDiagnostic> {
    throw new Error("Method not implemented.");
  }
}
