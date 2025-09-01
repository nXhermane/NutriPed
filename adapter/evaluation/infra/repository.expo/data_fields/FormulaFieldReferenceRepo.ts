import { FormulaFieldRefrenceRepo } from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { FormulaFieldReference } from "@/core/evaluation";
import { formula_field_references } from "../db/evaluation.schema";
import { FormulaFieldReferencePersistenceDto } from "../../dtos";

export class FormulaFieldReferenceExpoRepo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    FormulaFieldReference,
    FormulaFieldReferencePersistenceDto,
    typeof formula_field_references
  >
  implements FormulaFieldRefrenceRepo {}
