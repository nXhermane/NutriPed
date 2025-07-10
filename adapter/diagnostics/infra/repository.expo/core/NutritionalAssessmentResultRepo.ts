import {
  NutritionalAssessmentResult,
  NutritionalAssessmentResultRepository,
} from "@core/diagnostics";
import { EntityBaseRepositoryExpo } from "../../../../shared";
import { NutritionalAssessmentResultPersistenceDto } from "../..";
import { nutritional_assessment_results } from "../db";

export class NutritionalAssessmentResultRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    NutritionalAssessmentResult,
    NutritionalAssessmentResultPersistenceDto,
    typeof nutritional_assessment_results
  >
  implements NutritionalAssessmentResultRepository {}
