import {
  MonitoringParameter,
  MonitoringParameterRepository,
} from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { MonitoringParameterPersistenceDto } from "../../../dtos/next/core";
import { monitoring_parameters } from "../../db";
import { AggregateID } from "@/core/shared";

export class MonitoringParameterRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    MonitoringParameter,
    MonitoringParameterPersistenceDto,
    typeof monitoring_parameters
  >
  implements MonitoringParameterRepository
{
  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}
