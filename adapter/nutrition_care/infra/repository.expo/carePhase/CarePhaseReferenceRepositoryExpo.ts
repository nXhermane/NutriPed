import { SQLiteDatabase } from "expo-sqlite";
import {
  CarePhaseReference,
  CarePhaseReferenceRepository,
  MonitoringElementRepository,
  RecommendedTreatmentRepository,
} from "@/core/nutrition_care";
import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { care_phase_references } from "../db/nutrition_care.schema";
import { IEventBus, InfrastructureMapper, SystemCode } from "@/core/shared";
import { eq } from "drizzle-orm";
import {
  RepositoryException,
  RepositoryNotFoundError,
} from "@/adapter/shared/repository.expo/expo.repository.errors";
import {
  CarePhaseReferencePersistenceDto,
  CarePhaseReferencePersistenceRecordDto,
} from "../../dtos/carePhase";

export class CarePhaseReferenceRepositoryExpo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    CarePhaseReference,
    CarePhaseReferencePersistenceDto,
    typeof care_phase_references,
    CarePhaseReferencePersistenceRecordDto
  >
  implements CarePhaseReferenceRepository
{
  constructor(
    expo: SQLiteDatabase,
    mapper: InfrastructureMapper<
      CarePhaseReference,
      CarePhaseReferencePersistenceDto,
      CarePhaseReferencePersistenceRecordDto
    >,
    schema: typeof care_phase_references,
    private recommendedTreatmentRepository: RecommendedTreatmentRepository,
    private monitoringElementRepository: MonitoringElementRepository,
    eventBus: IEventBus
  ) {
    super(expo, mapper, schema, eventBus);
  }

  async getByCode(code: SystemCode<string>): Promise<CarePhaseReference> {
    try {
      const referencePersistence = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.code, code.unpack()))
        .get();

      if (!referencePersistence) {
        throw new RepositoryNotFoundError(
          `CarePhaseReference with code [${code}] not found.`
        );
      }

      const recordDto = await this.buildCompleteRecord(
        referencePersistence as CarePhaseReferencePersistenceDto
      );

      return this.mapper.toDomain(recordDto);
    } catch (e: unknown) {
      if (e instanceof RepositoryNotFoundError) {
        throw e;
      } else {
        throw new RepositoryException(
          `[${code}]: Failed to get CarePhaseReference by code`,
          e as Error
        );
      }
    }
  }

  private async buildCompleteRecord(
    referencePersistence: CarePhaseReferencePersistenceDto
  ): Promise<CarePhaseReferencePersistenceRecordDto> {
    const recommendedTreatments = await Promise.all(
      referencePersistence.recommendedTreatments.map(id =>
        this.recommendedTreatmentRepository.getById(id)
      )
    );

    const monitoringElements = await Promise.all(
      referencePersistence.monitoringElements.map(id =>
        this.monitoringElementRepository.getById(id)
      )
    );

    return {
      ...referencePersistence,
      recommendedTreatments,
      monitoringElements,
    };
  }

  // Override save pour sauvegarder les entités liées avec transaction
  async save(entity: CarePhaseReference, trx?: any): Promise<void> {
    // Si aucune transaction n'est fournie, créer une nouvelle transaction
    if (!trx) {
      return this.db.transaction(async transaction => {
        await this.saveWithTransaction(entity, transaction);
      });
    }

    // Sinon, utiliser la transaction fournie
    return this.saveWithTransaction(entity, trx);
  }

  private async saveWithTransaction(
    entity: CarePhaseReference,
    trx: any
  ): Promise<void> {
    // Sauvegarder d'abord les entités liées avec la même transaction
    const props = entity.getProps();

    // Vérifier et sauvegarder les traitements recommandés
    if (
      props.recommendedTreatments &&
      Array.isArray(props.recommendedTreatments)
    ) {
      const treatments = props.recommendedTreatments as any[];
      for (const treatment of treatments) {
        if (treatment) {
          await this.recommendedTreatmentRepository.save(treatment, trx);
        }
      }
    }

    // Vérifier et sauvegarder les éléments de suivi
    if (props.monitoringElements && Array.isArray(props.monitoringElements)) {
      const elements = props.monitoringElements as any[];
      for (const element of elements) {
        if (element) {
          await this.monitoringElementRepository.save(element, trx);
        }
      }
    }

    // Ensuite sauvegarder l'entité principale avec la transaction
    await super.save(entity, trx);
  }
}
