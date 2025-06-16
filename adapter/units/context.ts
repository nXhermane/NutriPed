import { IEventBus } from "@shared";
import { IndexedDBConnection, GenerateUUID, isWebEnv } from "../shared";
import {
  UnitInfraMapper,
  UnitRepositoryExpoImpl,
  UnitRepositoryWebImpl,
  units,
} from "./infra";
import {
  UnitMapper,
  UnitConverterService,
  CreateUnitUseCase,
  GetUnitUseCase,
  UpdateUnitUseCase,
  DeleteUnitUseCase,
  ConvertUnitUseCase,
  UnitService,
  UnitRepository,
} from "@core/units";
import { SQLiteDatabase } from "expo-sqlite";

export class UnitContext {
  private static instance: UnitContext | null = null;
  private readonly dbConnection: IndexedDBConnection | null;
  private readonly expo: SQLiteDatabase | null;
  private readonly eventBus: IEventBus;
  private readonly infraMapper: UnitInfraMapper;
  private readonly repository: UnitRepository;
  private readonly applicationMapper: UnitMapper;
  private readonly converterService: UnitConverterService;

  // Use Cases
  private readonly createUseCase: CreateUnitUseCase;
  private readonly getUseCase: GetUnitUseCase;
  private readonly updateUseCase: UpdateUnitUseCase;
  private readonly deleteUseCase: DeleteUnitUseCase;
  private readonly convertUseCase: ConvertUnitUseCase;

  // Service
  private readonly service: UnitService;

  private constructor(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    // Infrastructure
    if (isWebEnv() && dbConnection === null) {
      throw new Error(`The web db connection must be provided when isWebEnv`);
    }
    if (!isWebEnv() && expo === null) {
      throw new Error(
        `The expo db connection must be provided when is not a web env.`
      );
    }
    this.dbConnection = dbConnection;
    this.expo = expo;
    this.eventBus = eventBus;
    this.infraMapper = new UnitInfraMapper();
    this.repository = isWebEnv()
      ? new UnitRepositoryWebImpl(
          this.dbConnection as IndexedDBConnection,
          this.infraMapper,
          this.eventBus
        )
      : new UnitRepositoryExpoImpl(
          this.expo as SQLiteDatabase,
          this.infraMapper,
          units,
          this.eventBus
        );

    // Application
    this.applicationMapper = new UnitMapper();
    this.converterService = new UnitConverterService();

    // Use Cases
    this.createUseCase = new CreateUnitUseCase(
      new GenerateUUID(),
      this.repository
    );
    this.getUseCase = new GetUnitUseCase(
      this.repository,
      this.applicationMapper
    );
    this.updateUseCase = new UpdateUnitUseCase(this.repository);
    this.deleteUseCase = new DeleteUnitUseCase(this.repository);
    this.convertUseCase = new ConvertUnitUseCase(
      this.repository,
      this.converterService
    );

    // Service
    this.service = new UnitService({
      createUC: this.createUseCase,
      getUC: this.getUseCase,
      updateUC: this.updateUseCase,
      deleteUC: this.deleteUseCase,
      convertUC: this.convertUseCase,
    });
  }
  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    if (!UnitContext.instance) {
      this.instance = new UnitContext(dbConnection, expo, eventBus);
    }
    return this.instance as UnitContext;
  }

  getService(): UnitService {
    return this.service;
  }
  dispose(): void {
    UnitContext.instance = null;
  }
}
