import { ApplicationMapper, GenerateUniqueId, IEventBus, InfrastructureMapper, UseCase } from "@shared";
import { GenerateUUID, IndexedDBConnection } from "../common";
import {
   AddDataToMedicalRecordRequest,
   AddDataToMedicalRecordResponse,
   AddDataToMedicalRecordUseCase,
   AfterPatientCreatedMedicalHandler,
   AfterPatientDeletedMedicalRecordHandler,
   CreateMedicalRecordRequest,
   CreateMedicalRecordResponse,
   CreateMedicalRecordUseCase,
   DeleteMedicalRecordRequest,
   DeleteMedicalRecordResponse,
   DeleteMedicalRecordUseCase,
   GetMedicalRecordRequest,
   GetMedicalRecordResponse,
   GetMedicalRecordUseCase,
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
import { MedicalRecordPersistenceDto } from "./persistenceDto";
import { MedicalRecordInfraMapper } from "./mappers";
import { MedicalRecordRepositoryImpl } from "./repository.web";
import { PatientACLImpl } from "@core/sharedAcl";
import { PatientContext } from "../patient/context";
import { DiagnosticContext } from "../diagnostics/context";

export class MedicalRecordContext {
   private static instance: MedicalRecordContext | null = null;
   private readonly dbConnection: IndexedDBConnection;
   private readonly idGenerator: GenerateUniqueId;
   private readonly eventBus: IEventBus;
   // Infra Mappers
   private readonly infraMapper: InfrastructureMapper<MedicalRecord, MedicalRecordPersistenceDto>;
   // Repos
   private readonly repository: MedicalRecordRepository;
   // App Mappers
   private readonly appMapper: ApplicationMapper<MedicalRecord, MedicalRecordDto>;

   //UseCases
   private readonly createMedicalRecordUC: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>;
   private readonly getMedicalRecordUC: UseCase<GetMedicalRecordRequest, GetMedicalRecordResponse>;
   private readonly updateMedicalRecordUC: UseCase<UpdateMedicalRecordRequest, UpdateMedicalRecordResponse>;
   private readonly deleteMedicalRecordUC: UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>;
   private readonly addDataToMedicalRecordUC: UseCase<AddDataToMedicalRecordRequest, AddDataToMedicalRecordResponse>;
   // ACL
   private readonly patientACL: PatientACL;
   private readonly measurementACl: MeasurementValidationACL;
   // App services
   private readonly medicalRecordAppService: IMedicalRecordService;

   // Subscribers
   private readonly afterPatientCreatedHandler: AfterPatientCreatedMedicalHandler;
   private readonly afterPatientDeletedHandler: AfterPatientDeletedMedicalRecordHandler;

   private constructor(dbConnection: IndexedDBConnection, eventBus: IEventBus) {
      // Infrastructure
      this.dbConnection = dbConnection;
      this.eventBus = eventBus;
      this.patientACL = new PatientACLImpl(PatientContext.init(dbConnection, this.eventBus).getService());
      this.measurementACl = new MeasurementValidationACLImpl(
         DiagnosticContext.init(dbConnection, this.eventBus).getValidatePatientMeasurementsService(),
      );

      this.infraMapper = new MedicalRecordInfraMapper();
      this.repository = new MedicalRecordRepositoryImpl(this.dbConnection, this.infraMapper, this.eventBus);
      this.idGenerator = new GenerateUUID();

      // Application
      this.appMapper = new MedicalRecordMapper();
      this.createMedicalRecordUC = new CreateMedicalRecordUseCase(this.idGenerator, this.repository, this.patientACL);
      this.getMedicalRecordUC = new GetMedicalRecordUseCase(this.repository, this.appMapper);
      this.updateMedicalRecordUC = new UpdateMedicalRecordUseCase(this.repository, this.measurementACl);
      this.addDataToMedicalRecordUC = new AddDataToMedicalRecordUseCase(this.repository, this.measurementACl);
      this.deleteMedicalRecordUC = new DeleteMedicalRecordUseCase(this.repository);
      // Subscribers
      this.afterPatientCreatedHandler = new AfterPatientCreatedMedicalHandler(this.createMedicalRecordUC);
      this.afterPatientDeletedHandler = new AfterPatientDeletedMedicalRecordHandler(this.deleteMedicalRecordUC);
      this.eventBus.subscribe(this.afterPatientCreatedHandler);
      this.eventBus.subscribe(this.afterPatientDeletedHandler);
      this.medicalRecordAppService = new MedicalRecordService({
         addDataUC: this.addDataToMedicalRecordUC,
         createUC: this.createMedicalRecordUC,
         deleteUC: this.deleteMedicalRecordUC,
         getUC: this.getMedicalRecordUC,
         updateUC: this.updateMedicalRecordUC,
      });
   }
   static init(dbConnection: IndexedDBConnection, eventBus: IEventBus) {
      if (!this.instance) {
         this.instance = new MedicalRecordContext(dbConnection, eventBus);
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
