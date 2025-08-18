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
  GetNormalizedAnthropometricDataRequest,
  GetNormalizedAnthropometricDataResponse,
  GetNormalizedAnthropometricDataUseCase,
  IClinicalSignDataInterpretationACL,
  IMedicalRecordService,
  INormalizeAnthropometricDataACL,
  MeasurementValidationACL,
  MeasurementValidationACLImpl,
  MedicalRecord,
  MedicalRecordDto,
  MedicalRecordMapper,
  MedicalRecordRepository,
  MedicalRecordService,
  NormalizeAnthropomericDataACL,
  PatientACL,
  UpdateMedicalRecordRequest,
  UpdateMedicalRecordResponse,
  UpdateMedicalRecordUseCase,
} from "@core/medical_record";

import { PatientACLImpl } from "@core/sharedAcl";
import { PatientContext } from "../patient/context";
import { DiagnosticContext } from "../evaluation/context";
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


export interface MedicalRecordAcls {
  patientAcl: PatientACL
  measurementACl: MeasurementValidationACL;
  clinicalSignDataInterpreterACL: IClinicalSignDataInterpretationACL;
  normalizeAnthropometricDataACL: INormalizeAnthropometricDataACL;
}
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
  private createMedicalRecordUC: UseCase<
    CreateMedicalRecordRequest,
    CreateMedicalRecordResponse
  >;
  private readonly getMedicalRecordUC: UseCase<
    GetMedicalRecordRequest,
    GetMedicalRecordResponse
  >;
  private updateMedicalRecordUC: UseCase<
    UpdateMedicalRecordRequest,
    UpdateMedicalRecordResponse
  >;
  private readonly deleteMedicalRecordUC: UseCase<
    DeleteMedicalRecordRequest,
    DeleteMedicalRecordResponse
  >;
  private addDataToMedicalRecordUC: UseCase<
    AddDataToMedicalRecordRequest,
    AddDataToMedicalRecordResponse
  >;
  private readonly deleteDataFromMedicalRecordUC: UseCase<
    DeleteDataFromMedicalRecordRequest,
    DeleteDataFromMedicalRecordResponse
  >;
  private getNormalizeAnthropometricDataUC: UseCase<
    GetNormalizedAnthropometricDataRequest,
    GetNormalizedAnthropometricDataResponse
  >;
  // ACL
  private acls: MedicalRecordAcls | undefined
  // private readonly patientACL: PatientACL;
  // private readonly measurementACl: MeasurementValidationACL;
  // private readonly clinicalSignDataInterpreterACL: IClinicalSignDataInterpretationACL;
  // private readonly normalizeAnthropometricDataACL: INormalizeAnthropometricDataACL;
  // App services
  private medicalRecordAppService: IMedicalRecordService;

  // Subscribers
  private readonly afterPatientCreatedHandler: AfterPatientCreatedMedicalHandler;
  private readonly afterPatientDeletedHandler: AfterPatientDeletedMedicalRecordHandler;

  private constructor(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus, alcs?: MedicalRecordAcls
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
    this.acls = alcs
    // this.patientACL = new PatientACLImpl(
    //   PatientContext.init(dbConnection, expo, this.eventBus).getService()
    // );
    // this.measurementACl = new MeasurementValidationACLImpl(
    //   DiagnosticContext.init(
    //     dbConnection,
    //     expo,
    //     this.eventBus
    //   ).getValidatePatientMeasurementsService()
    // );
    // this.clinicalSignDataInterpreterACL = new ClinicalSignDataInterpretationACL(
    //   DiagnosticContext.init(
    //     dbConnection,
    //     expo,
    //     this.eventBus
    //   ).getMakeClinicalSignDataInterpretationService()
    // );
    // this.normalizeAnthropometricDataACL = new NormalizeAnthropomericDataACL(
    //   DiagnosticContext.init(
    //     dbConnection,
    //     expo,
    //     this.eventBus
    //   ).getNormalizeAnthropomtricDataService()
    // );

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
      this.acls?.patientAcl! // FIND: FIND SOLUTION FOR CICULAR DEPENDENCY 
    );
    this.getMedicalRecordUC = new GetMedicalRecordUseCase(
      this.repository,
      this.appMapper
    );
    this.updateMedicalRecordUC = new UpdateMedicalRecordUseCase(
      this.repository,
      this.acls?.measurementACl!,// FIND: FIND SOLUTION FOR CICULAR DEPENDENCY 
      this.acls?.clinicalSignDataInterpreterACL! // FIND: FIND SOLUTION FOR CICULAR DEPENDENCY 
    );
    this.addDataToMedicalRecordUC = new AddDataToMedicalRecordUseCase(
      this.idGenerator,
      this.repository,
      this.acls?.measurementACl!,// FIND: FIND SOLUTION FOR CICULAR DEPENDENCY 
      this.acls?.clinicalSignDataInterpreterACL!
    );
    this.deleteDataFromMedicalRecordUC = new DeleteDataFromMedicalRecordUseCase(
      this.repository
    );
    this.deleteMedicalRecordUC = new DeleteMedicalRecordUseCase(
      this.repository
    );
    this.getNormalizeAnthropometricDataUC =
      new GetNormalizedAnthropometricDataUseCase(
        this.repository,
        this.acls?.normalizeAnthropometricDataACL! // FIND: FIND SOLUTION FOR CICULAR DEPENDENCY 
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
      getNormalizeAnthropDataUC: this.getNormalizeAnthropometricDataUC,
    });
  }
  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus,

  ) {
    if (!this.instance) {
      this.instance = new MedicalRecordContext(dbConnection, expo, eventBus);
    }
    return this.instance as MedicalRecordContext;
  }
  setAcls(acls: MedicalRecordAcls) {
    this.acls = acls
    console.log("Set MedicalRecord acls after instantiation without acls");

    this.createMedicalRecordUC = new CreateMedicalRecordUseCase(
      this.idGenerator,
      this.repository,
      acls.patientAcl
    );
    this.updateMedicalRecordUC = new UpdateMedicalRecordUseCase(
      this.repository,
      acls.measurementACl,
      acls.clinicalSignDataInterpreterACL
    );
    this.addDataToMedicalRecordUC = new AddDataToMedicalRecordUseCase(
      this.idGenerator,
      this.repository,
      acls.measurementACl,
      acls.clinicalSignDataInterpreterACL
    );
    this.getNormalizeAnthropometricDataUC =
      new GetNormalizedAnthropometricDataUseCase(
        this.repository,
        acls.normalizeAnthropometricDataACL
      );

    this.medicalRecordAppService = new MedicalRecordService({
      addDataUC: this.addDataToMedicalRecordUC,
      createUC: this.createMedicalRecordUC,
      deleteUC: this.deleteMedicalRecordUC!,
      getUC: this.getMedicalRecordUC!,
      updateUC: this.updateMedicalRecordUC,
      deleteDataUC: this.deleteDataFromMedicalRecordUC!,
      getNormalizeAnthropDataUC: this.getNormalizeAnthropometricDataUC,
    });
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
