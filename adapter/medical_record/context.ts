import {
  ApplicationMapper,
  GenerateUniqueId,
  IEventBus,
  InfrastructureMapper,
  UseCase,
} from "@shared";

import {
  AddDataToMedicalRecordRequest,
  AddDataToMedicalRecordResponse,
  AddDataToMedicalRecordUseCase,
  AfterPatientCreatedMedicalHandler,
  AfterPatientDeletedMedicalRecordHandler,
  CreateMedicalRecordRequest,
  CreateMedicalRecordResponse,
  CreateMedicalRecordUseCase,
  DeleteDataFromMedicalRecordRequest,
  DeleteDataFromMedicalRecordResponse,
  DeleteDataFromMedicalRecordUseCase,
  DeleteMedicalRecordRequest,
  DeleteMedicalRecordResponse,
  DeleteMedicalRecordUseCase,
  GetMedicalRecordRequest,
  GetMedicalRecordResponse,
  GetMedicalRecordUseCase,
  IClinicalSignDataInterpretationACL,
  IMedicalRecordService,
  MeasurementValidationACL,
  MeasurementValidationACLImpl,
  MedicalRecord,
  MedicalRecordDto,
  MedicalRecordMapper,
  MedicalRecordRepository,
  MedicalRecordService,
  PatientACL,
  UpdateMedicalRecordRequest,
  UpdateMedicalRecordResponse,
  UpdateMedicalRecordUseCase,
} from "@core/medical_record";

import { PatientACLImpl } from "@core/sharedAcl";
import { PatientContext } from "../patient/context";
import { DiagnosticContext } from "../diagnostics/context";
import {
  MedicalRecordPersistenceDto,
  MedicalRecordInfraMapper,
  MedicalRecordRepositoryWebImpl,
  MedicalRecordRepositoryExpoImpl,
  medical_records,
} from "./infra";
import { IndexedDBConnection, GenerateUUID, isWebEnv } from "../shared";
import { SQLiteDatabase } from "expo-sqlite";
import { ClinicalSignDataInterpretationACL } from "@/core/medical_record/adapter/acl/ClinicalSignDataInterpretationACl";

export class MedicalRecordContext {
  private static instance: MedicalRecordContext | null = null;
  private readonly dbConnection: IndexedDBConnection | null;
  private readonly expo: SQLiteDatabase | null;
  private readonly idGenerator: GenerateUniqueId;
  private readonly eventBus: IEventBus;
  // Infra Mappers
  private readonly infraMapper: InfrastructureMapper<
    MedicalRecord,
    MedicalRecordPersistenceDto
  >;
  // Repos
  private readonly repository: MedicalRecordRepository;
  // App Mappers
  private readonly appMapper: ApplicationMapper<
    MedicalRecord,
    MedicalRecordDto
  >;

  //UseCases
  private readonly createMedicalRecordUC: UseCase<
    CreateMedicalRecordRequest,
    CreateMedicalRecordResponse
  >;
  private readonly getMedicalRecordUC: UseCase<
    GetMedicalRecordRequest,
    GetMedicalRecordResponse
  >;
  private readonly updateMedicalRecordUC: UseCase<
    UpdateMedicalRecordRequest,
    UpdateMedicalRecordResponse
  >;
  private readonly deleteMedicalRecordUC: UseCase<
    DeleteMedicalRecordRequest,
    DeleteMedicalRecordResponse
  >;
  private readonly addDataToMedicalRecordUC: UseCase<
    AddDataToMedicalRecordRequest,
    AddDataToMedicalRecordResponse
  >;
  private readonly deleteDataFromMedicalRecordUC: UseCase<
    DeleteDataFromMedicalRecordRequest,
    DeleteDataFromMedicalRecordResponse
  >;
  // ACL
  private readonly patientACL: PatientACL;
  private readonly measurementACl: MeasurementValidationACL;
  private readonly clinicalSignDataInterpreterACL: IClinicalSignDataInterpretationACL;
  // App services
  private readonly medicalRecordAppService: IMedicalRecordService;

  // Subscribers
  private readonly afterPatientCreatedHandler: AfterPatientCreatedMedicalHandler;
  private readonly afterPatientDeletedHandler: AfterPatientDeletedMedicalRecordHandler;

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
    this.patientACL = new PatientACLImpl(
      PatientContext.init(dbConnection, expo, this.eventBus).getService()
    );
    this.measurementACl = new MeasurementValidationACLImpl(
      DiagnosticContext.init(
        dbConnection,
        expo,
        this.eventBus
      ).getValidatePatientMeasurementsService()
    );
    this.clinicalSignDataInterpreterACL = new ClinicalSignDataInterpretationACL(
      DiagnosticContext.init(
        dbConnection,
        expo,
        this.eventBus
      ).getMakeClinicalSignDataInterpretationService()
    );

    this.infraMapper = new MedicalRecordInfraMapper();
    this.repository = isWebEnv()
      ? new MedicalRecordRepositoryWebImpl(
          this.dbConnection as IndexedDBConnection,
          this.infraMapper,
          this.eventBus
        )
      : new MedicalRecordRepositoryExpoImpl(
          this.expo as SQLiteDatabase,
          this.infraMapper,
          medical_records,
          this.eventBus
        );
    this.idGenerator = new GenerateUUID();

    // Application
    this.appMapper = new MedicalRecordMapper();
    this.createMedicalRecordUC = new CreateMedicalRecordUseCase(
      this.idGenerator,
      this.repository,
      this.patientACL
    );
    this.getMedicalRecordUC = new GetMedicalRecordUseCase(
      this.repository,
      this.appMapper
    );
    this.updateMedicalRecordUC = new UpdateMedicalRecordUseCase(
      this.repository,
      this.measurementACl,
      this.clinicalSignDataInterpreterACL
    );
    this.addDataToMedicalRecordUC = new AddDataToMedicalRecordUseCase(
      this.idGenerator,
      this.repository,
      this.measurementACl,
      this.clinicalSignDataInterpreterACL
    );
    this.deleteDataFromMedicalRecordUC = new DeleteDataFromMedicalRecordUseCase(
      this.repository
    );
    this.deleteMedicalRecordUC = new DeleteMedicalRecordUseCase(
      this.repository
    );
    // Subscribers
    this.afterPatientCreatedHandler = new AfterPatientCreatedMedicalHandler(
      this.createMedicalRecordUC
    );
    this.afterPatientDeletedHandler =
      new AfterPatientDeletedMedicalRecordHandler(this.deleteMedicalRecordUC);
    this.eventBus.subscribe(this.afterPatientCreatedHandler);
    this.eventBus.subscribe(this.afterPatientDeletedHandler);
    this.medicalRecordAppService = new MedicalRecordService({
      addDataUC: this.addDataToMedicalRecordUC,
      createUC: this.createMedicalRecordUC,
      deleteUC: this.deleteMedicalRecordUC,
      getUC: this.getMedicalRecordUC,
      updateUC: this.updateMedicalRecordUC,
      deleteDataUC: this.deleteDataFromMedicalRecordUC,
    });
  }
  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    if (!this.instance) {
      this.instance = new MedicalRecordContext(dbConnection, expo, eventBus);
    }
    return this.instance as MedicalRecordContext;
  }
  getMedicalRecordService(): IMedicalRecordService {
    return this.medicalRecordAppService;
  }
  dispose(): void {
    this.eventBus.unsubscribe(this.afterPatientCreatedHandler);
    this.eventBus.unsubscribe(this.afterPatientDeletedHandler);
    MedicalRecordContext.instance = null;
  }
}
