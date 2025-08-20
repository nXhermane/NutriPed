import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared";
import { NextClinicalDomain } from "@/core/evaluation";
import { NextClinicalInfraDtos } from "../../../dtos";
import { next_clinical_sign_references } from "../../db";

export class ClinicalSignReferenceRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    NextClinicalDomain.ClinicalSignReference,
    NextClinicalInfraDtos.ClinicalSignReferencePersistenceDto,
    typeof next_clinical_sign_references
  >
  implements NextClinicalDomain.ClinicalSignReferenceRepository {}
