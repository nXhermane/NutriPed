import {
  PatientMapper,
  CreatePatientUseCase,
  GetPatientUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase,
  PatientService,
  PatientRepository,
} from "@core/patient";
import { IEventBus } from "@shared";
import {
  PatientInfraMapper,
  PatientRepositoryExpoImpl,
  PatientRepositoryWebImpl,
  patients,
} from "./infra";
import { IndexedDBConnection, GenerateUUID, isWebEnv } from "../shared";
import { SQLiteDatabase } from "expo-sqlite";

export class PatientContext {
  private static instance: PatientContext | null = null;
  private readonly dbConnection: IndexedDBConnection | null = null;
  private readonly expo: SQLiteDatabase | null = null;
  private readonly eventBus: IEventBus;
  private readonly infraMapper: PatientInfraMapper;
  private readonly repository: PatientRepository;
  private readonly applicationMapper: PatientMapper;

  // Use Cases
  private readonly createUseCase: CreatePatientUseCase;
  private readonly getUseCase: GetPatientUseCase;
  private readonly updateUseCase: UpdatePatientUseCase;
  private readonly deleteUseCase: DeletePatientUseCase;

  // Service
  private readonly patientService: PatientService;

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
    dbConnection;
    this.infraMapper = new PatientInfraMapper();
    this.repository = isWebEnv()
      ? new PatientRepositoryWebImpl(
          this.dbConnection as IndexedDBConnection,
          this.infraMapper,
          this.eventBus
        )
      : new PatientRepositoryExpoImpl(
          this.expo as SQLiteDatabase,
          this.infraMapper,
          patients
        );

    // Application
    this.applicationMapper = new PatientMapper();

    // Use Cases
    this.createUseCase = new CreatePatientUseCase(
      new GenerateUUID(),
      this.repository
    );
    this.getUseCase = new GetPatientUseCase(
      this.repository,
      this.applicationMapper
    );
    this.updateUseCase = new UpdatePatientUseCase(this.repository);
    this.deleteUseCase = new DeletePatientUseCase(this.repository);

    // Service
    this.patientService = new PatientService({
      createUC: this.createUseCase,
      getUC: this.getUseCase,
      updateUC: this.updateUseCase,
      deleteUC: this.deleteUseCase,
    });
  }
  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    if (!PatientContext.instance) {
      this.instance = new PatientContext(dbConnection, expo, eventBus);
    }
    return PatientContext.instance as PatientContext;
  }
  getService(): PatientService {
    return this.patientService;
  }
  dispose(): void {
    PatientContext.instance = null;
  }
}
