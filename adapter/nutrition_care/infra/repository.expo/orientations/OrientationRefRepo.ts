import {
  OrientationReference,
  OrientationReferenceRepository,
} from "@core/nutrition_care";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { OrientationReferencePersistenceDto } from "../../dtos";
import { orientation_references } from "../db";

export class OrientationReferenceRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    OrientationReference,
    OrientationReferencePersistenceDto,
    typeof orientation_references
  >
  implements OrientationReferenceRepository {}
