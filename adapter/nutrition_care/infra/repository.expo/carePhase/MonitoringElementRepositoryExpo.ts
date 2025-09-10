import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { MonitoringElementPersistenceDto } from "../../dtos/carePhase/MonitoringElementPersistenceDto";
import { monitoring_elements } from "../db/nutrition_care.schema";
import { MonitoringElement, MonitoringElementRepository } from "@/core/nutrition_care";

export class MonitoringElementRepositoryExpo
    extends EntityBaseRepositoryExpoWithCodeColumn<
        MonitoringElement,
        MonitoringElementPersistenceDto,
        typeof monitoring_elements
    >
    implements MonitoringElementRepository { }
