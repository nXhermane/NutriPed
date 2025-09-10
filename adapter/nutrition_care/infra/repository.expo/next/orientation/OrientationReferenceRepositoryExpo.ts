import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { OrientationReferencePersistenceDto } from "../../../dtos/next/orientation";
import { next_orientation_references } from "../../db/nutrition_care.schema";
import { NextNutritionCare } from "@/core/nutrition_care";

export class OrientationReferenceRepositoryExpo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    NextNutritionCare.OrientationReference,
    OrientationReferencePersistenceDto,
    typeof next_orientation_references
  >
  implements NextNutritionCare.OrientationReferenceRepository {}
