import {
  EntityBaseRepositoryExpo,
  EntityBaseRepositoryExpoWithCodeColumn,
} from "@/adapter/shared/repository.expo";
import { RecommendedTreatmentPersistenceDto } from "../../dtos/carePhase/RecommendedTreatmentPersistenceDto";
import { recommended_treatments } from "../db/nutrition_care.schema";
import {
  RecommendedTreatment,
  RecommendedTreatmentRepository,
} from "@/core/nutrition_care";

export class RecommendedTreatmentRepositoryExpo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    RecommendedTreatment,
    RecommendedTreatmentPersistenceDto,
    typeof recommended_treatments
  >
  implements RecommendedTreatmentRepository {}
