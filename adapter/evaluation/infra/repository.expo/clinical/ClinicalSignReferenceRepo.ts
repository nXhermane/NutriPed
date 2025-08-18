import {
  ClinicalSignReference,
  ClinicalSignReferenceRepository,
} from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { ClinicalSignReferencePersistenceDto } from "../..";
import { clinical_sign_references } from "../db";

export class ClinicalSignReferenceRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    ClinicalSignReference,
    ClinicalSignReferencePersistenceDto,
    typeof clinical_sign_references
  >
  implements ClinicalSignReferenceRepository {}
