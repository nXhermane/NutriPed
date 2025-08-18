import { Indicator, IndicatorRepository } from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { IndicatorPersistenceDto } from "../..";
import { indicators } from "../db";

export class IndicatorRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    Indicator,
    IndicatorPersistenceDto,
    typeof indicators
  >
  implements IndicatorRepository {}
