import { CarePhase, CarePhaseRepository, MonitoringParameter, OnGoingTreatment } from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { CarePhasePersistenceDto, CarePhasePersistenceRecordDto } from "../../../dtos/next/core";
import { care_phases } from "../../db";
import { AggregateID, IEventBus, InfrastructureMapper, Repository } from "@/core/shared";
import { eq } from "drizzle-orm";
import { RepositoryException, RepositoryNotFoundError } from "../../../../../shared/repository.expo/expo.repository.errors";
import { CarePhaseInfraMapper } from "../../../mappers/next/core/CarePhaseMapper";
import { SQLiteDatabase } from "expo-sqlite";
import { NextCore } from "@/core/nutrition_care";

export class CarePhaseRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    CarePhase,
    CarePhasePersistenceDto,
    typeof care_phases,
    CarePhasePersistenceRecordDto
  >
  implements CarePhaseRepository
{

  constructor(
    expo: SQLiteDatabase,
    mapper: InfrastructureMapper<NextCore.CarePhase,CarePhasePersistenceDto,CarePhasePersistenceRecordDto>,
    private monitoringParameterRepository: NextCore.MonitoringParameterRepository,
    private onGoingTreatmentRepository: NextCore.OnGoingTreatmentRepository,
    eventBus: IEventBus | null = null
  ) {
    super(
      expo,
     mapper,
      care_phases,
      eventBus
    );
  }

  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }

  // Override getById pour gérer la reconstruction complexe
  async getById(id: AggregateID): Promise<CarePhase> {
    try {
      const record = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id as string))
        .get();

      if (!record) {
        throw new RepositoryNotFoundError(`CarePhase with id [${id}] not found.`);
      }

      // Reconstruire les entités liées à partir des IDs stockés
      const recordDto = await this.buildCompleteRecord(record as CarePhasePersistenceDto);
      
      return this.mapper.toDomain(recordDto);
    } catch (e: unknown) {
      if (e instanceof RepositoryNotFoundError) {
        throw e;
      } else {
        throw new RepositoryException(
          `[${id}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }

  private async buildCompleteRecord(
    phasePersistence: CarePhasePersistenceDto
  ): Promise<CarePhasePersistenceRecordDto> {
    // Récupérer les entités liées par leurs IDs
    const monitoringParameters = await Promise.all(
      phasePersistence.monitoringParameters.map(id => this.monitoringParameterRepository.getById(id))
    );

    const onGoingTreatments = await Promise.all(
      phasePersistence.onGoingTreatments.map(id => this.onGoingTreatmentRepository.getById(id))
    );

    return {
      ...phasePersistence,
      monitoringParameters,
      onGoingTreatments
    };
  }

  // Override save pour sauvegarder les entités liées
  async save(entity: CarePhase, trx?: any): Promise<void> {
    // Sauvegarder d'abord les entités liées
    const monitoringParameters = entity.getProps().monitoringParameters;
    for (const param of monitoringParameters) {
      await this.monitoringParameterRepository.save(param, trx);
    }

    const onGoingTreatments = entity.getProps().onGoingTreatments;
    for (const treatment of onGoingTreatments) {
      await this.onGoingTreatmentRepository.save(treatment, trx);
    }

    // Ensuite sauvegarder l'entité principale
    await super.save(entity, trx);
  }
}