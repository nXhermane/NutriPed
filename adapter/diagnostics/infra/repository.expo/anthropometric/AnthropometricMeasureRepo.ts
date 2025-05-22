import {
  AnthropometricMeasure,
  AnthropometricMeasureRepository,
} from "@core/diagnostics";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { AnthropometricMeasurePersistenceDto } from "../../dtos";
import { anthropometric_measures } from "../db";

export class AnthropometricMeasureRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    AnthropometricMeasure,
    AnthropometricMeasurePersistenceDto,
    typeof anthropometric_measures
  >
  implements AnthropometricMeasureRepository {}
