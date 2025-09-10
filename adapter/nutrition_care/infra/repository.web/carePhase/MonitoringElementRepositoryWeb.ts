import { EntityBaseRepositoryWeb } from "@/adapter/shared";
import { MonitoringElementPersistenceDto } from "../../dtos/carePhase/MonitoringElementPersistenceDto";
import { MonitoringElement, MonitoringElementRepository } from "@/core/nutrition_care";

export class MonitoringElementRepositoryWeb
  extends EntityBaseRepositoryWeb<MonitoringElement, MonitoringElementPersistenceDto>
  implements MonitoringElementRepository
{
  protected storeName = "monitoring_elements";
}
