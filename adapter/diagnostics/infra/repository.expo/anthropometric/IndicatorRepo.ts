import { Indicator, IndicatorRepository } from "@core/diagnostics";
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
