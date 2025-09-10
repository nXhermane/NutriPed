import {
  ApplicationMapper,
  Factory,
  GenerateUniqueId,
  IEventBus,
  InfrastructureMapper,
  UseCase,
} from "@shared";

import {
  AddDataToPatientCareSessionRequest,
  AddDataToPatientCareSessionResponse,
  AppetiteTestRef,
  AppetiteTestRefRepository,
  Complication,
  ComplicationRepository,
  CreatePatientCareSessionProps,
  CreatePatientCareSessionRequest,
  CreatePatientCareSessionResponse,
  DailyCareJournal,
  DailyCareJournalMapper,
  DailyCareJournalRepository,
  EvaluatePatientAppetiteRequest,
  EvaluatePatientAppetiteResponse,
  GetPatientCareSessionRequest,
  GetPatientCareSessionResponse,
  IOrientationService,
  IPatientCareSessionAppService,
  IPatientDailyJournalGenerator,
  MakePatientCareSessionReadyRequest,
  MakePatientCareSessionReadyResponse,
  Medicine,
  MedicineRepository,
  Milk,
  MilkRepository,
  OrientPatientRequest,
  OrientPatientResponse,
  OrientationReference,
  OrientationReferenceRepository,
  OrientationService,
  PatientCareSession,
  PatientCareSessionFactory,
  PatientCareSessionMapper,
  PatientCareSessionRepository,
  PatientCareSessionAppService,
  PatientCurrentState,
  PatientCurrentStateRepository,
  PatientDailyJournalGenerator,
  IAppetiteTestService,
  IMedicineDosageService,
  ITherapeuticMilkAdvisorService,
  AppetiteTestRefDto,
  ComplicationDto,
  MedicineDto,
  MilkDto,
  OrientationRefDto,
  PatientCurrentStateDto,
  PatientCareSessionDto,
  DailyCareJournalDto,
  CreateAppetiteTestRequest,
  CreateAppetiteTestResponse,
  GetAppetiteTestRequest,
  GetAppetiteTestResponse,
  EvaluateAppetiteRequest,
  EvaluateAppetiteResponse,
  CreateComplicationRequest,
  CreateComplicationResponse,
  GetComplicationRequest,
  GetComplicationResponse,
  CreateMedicineResponse,
  GetMedicineRequest,
  GetMedicineResponse,
  GetMedicineDosageRequest,
  GetMedicineDosageResponse,
  CreateMilkRequest,
  CreateMilkResponse,
  SuggestMilkRequest,
  SuggestMilkResponse,
  CreateOrientationRefRequest,
  CreateOrientationRefResponse,
  GetOrientationRefRequest,
  GetOrientationRefResponse,
  OrientRequest,
  OrientResponse,
  IAppetiteTestAppService,
  IComplicationAppService,
  IMedicineAppService,
  IMilkAppService,
  IOrientationAppService,
  AppetiteTestService,
  MedicineDosageService,
  TherapeuticMilkAdvisorService,
  AppetiteTestReferenceMapper,
  ComplicationMapper,
  MedicineMapper,
  MilkMapper,
  OrientationRefMapper,
  PatientCurrentStateMapper,
  CarePhase,
  CreateAppetiteTestUseCase,
  GetAppetiteTestUseCase,
  EvaluateAppetiteUseCase,
  CreateComplicationUseCase,
  GetComplicationUseCase,
  CreateMedicineUseCase,
  CreateMedicineRequest,
  GetMedicineUseCase,
  GetMedicineDosageUseCase,
  CreateMilkUseCase,
  GetMilkUseCase,
  GetMilkRequest,
  GetMilkResponse,
  SuggestMilkUseCase,
  CreateOrientationRefUseCase,
  GetOrientationRefUseCase,
  OrientUseCase,
  AddDataToPatientCareSessionUseCase,
  CreatePatientCareSessionUseCase,
  GetPatientCareSessionUseCase,
  MakePatientCareSessionReadyUseCase,
  OrientPatientUseCase,
  EvaluatePatientAppetiteUseCase,
  AppetiteTestAppService,
  ComplicationAppService,
  MedicineAppService,
  MilkAppService,
  OrientationAppService,
  AfterPatientGlobalVariablePerformedEvent,
  GetDailyJournalRequest,
  GetDailyJouranlResponse,
  GetDailyJournalUseCase,
  NextNutritionCare,
  NextMedicinesDto,
  NextMedicinesUseCases,
  NextNutritionCareAppService,
  NextMedicinesMapper,
  NextCoreDtos,
  NextCoreMapper,
  NextNutritionalProductMapper,
  NextMilkMapper,
  NextNutritionalProductUseCases,
  NextMilkUseCases,
  NextOrientationUseCases,
  NextCore,
  CarePhaseReference,
  CarePhaseReferenceRepository,
  CarePhaseReferenceOrchestrator,
  ICarePhaseReferenceOrchestrator,
  CreateCarePhaseReference,
  CreateCarePhaseReferenceRequest,
  CreateCarePhaseReferenceResponse,
  GetCarePhaseReferenceRequest,
  GetCarePhaseReferenceResponse,
  ICarePhaseReferenceAppService,
  RecommendedTreatment,
  MonitoringElement,
  RecommendedTreatmentRepository,
  MonitoringElementRepository,
  CarePhaseReferenceFactory,
  CarePhaseRefMapper,
  GetCarePhaseReferenceUseCase,
  CreateCarePhaseReferenceUseCase,
  NextCoreUseCases,
  ICommunicationService,
  ICompletionService,
  IDailyCareActionService,
  IDailyCareRecordService,
  IDailyMonitoringTaskService,
  IMonitoringParameterService,
  IOnGoingTreatmentService,
  IOrchestrationService,
  IPatientCareSessionServiceNext,
  IRecommendedTreatmentService,
  RecommendedTreatmentService,
  PatientCareSessionAggregateMapper,
} from "@core/nutrition_care";

import { PatientACLImpl } from "@core/sharedAcl";
import { PatientContext } from "../patient/context";
import { IndexedDBConnection, GenerateUUID, isWebEnv } from "../shared";
import {
  AppetiteTestReferencePersistenceDto,
  ComplicationPersistenceDto,
  MedicinePersistenceDto,
  MilkPersistenceDto,
  OrientationReferencePersistenceDto,
  DailyJournalPersistenceDto,
  PatientCurrentStatePersistenceDto,
  PatientCareSessionPersistenceDto,
  AppetiteTestInfraMapper,
  ComplicationInfraMapper,
  MedicineInfraMapper,
  MilkInfraMapper,
  OrientationReferenceInfraMapper,
  PatientCurrentStateInfraMapper,
  DailyCareJournalInfraMapper,
  PatientCareSessionInfraMapper,
  AppetiteTestRefRepositoryWebImpl,
  ComplicationRepositoryWebImpl,
  DailyCareJournalRepositoryWebImpl,
  MedicineRepositoryWebImpl,
  MilkRepositoryWebImpl,
  OrientationReferenceRepositoryWebImpl,
  PatientCareSessionRepositoryWebImpl,
  PatientCurrentStateRepositoryWebImpl,
  AppetiteTestRefRepositoryExpoImpl,
  appetite_test_references,
  ComplicationRepositoryExpoImpl,
  complications,
  MedicineRepositoryExpoImpl,
  medicines,
  MilkRepositoryExpoImpl,
  milks,
  OrientationReferenceRepositoryExpoImpl,
  orientation_references,
  DailyCareJournalRepositoryExpoImpl,
  daily_care_journals,
  PatientCurrentStateRepositoryExpoImpl,
  patient_current_states,
  PatientCareSessionRepositoryExpoImpl,
  patient_care_sessions,
  NextNutritionCareInfra,
  NextNutritionCareInfraMapper,
  NextNutritionCareRepoExpo,
  next_medicines,
  next_nutritional_products,
  next_milks,
  next_orientation_references,
  care_phases,
  daily_care_actions,
  daily_monitoring_tasks,
  daily_care_records,
  messages,
  monitoring_parameters,
  on_going_treatments,
  user_response_summaries,
  patient_care_session_aggregates,
  NextNutritionCareRepoWeb,
  care_phase_references,
  recommended_treatments,
  monitoring_elements,
} from "./infra";
import { SQLiteDatabase } from "expo-sqlite";
import { CarePhaseMapper } from "@/core/nutrition_care/application/mappers/CarePhaseMapper";
import { CarePhaseDto } from "@/core/nutrition_care/application/dtos/core";
import { NextOrientationAppMapper } from "@/core/nutrition_care/application/mappers/next";
import { CarePhaseReferencePersistenceDto, CarePhaseReferencePersistenceRecordDto, MonitoringElementPersistenceDto, RecommendedTreatmentPersistenceDto } from "./infra/dtos/carePhase";
import { CarePhaseReferenceDto } from "@/core/nutrition_care/application/dtos/carePhase";
import { CarePhaseReferenceRepositoryExpo, MonitoringElementRepositoryExpo, RecommendedTreatmentRepositoryExpo } from "./infra/repository.expo/carePhase";
import { CarePhaseReferenceRepositoryWeb } from "./infra/repository.web/carePhase/CarePhaseReferenceRepositoryWeb";
import { CarePhaseReferenceInfraMapper } from "./infra/mappers/CarePhaseReferenceMapper";
import { RecommendedTreatmentInfraMapper } from "./infra/mappers/RecommendedTreatmentMapper";
import { MonitoringElementInfraMapper } from "./infra/mappers/MonitoringElementMapper";
import { RecommendedTreatmentRepositoryWeb } from "./infra/repository.web/carePhase/RecommendedTreatmentRepositoryWeb";
import { MonitoringElementRepositoryWeb } from "./infra/repository.web/carePhase/MonitoringElementRepositoryWeb";
import { CarePhaseReferenceAppService } from "@/core/nutrition_care/application/services/CarePhaseAppService";
import { IComputedVariablePerformerACL } from "@/core/nutrition_care/domain/next";
import { ComputedVariablePerformerAcl } from "@/core/nutrition_care/adapter/acl/ComputedVariablePerformerAcl";
import { DiagnosticContext } from "../evaluation";
import { MedicalRecordVariableTransformerAclImpl } from "@/core/nutrition_care/adapter";
import { MedicalRecordContext } from "../medical_record";
import { NextCoreAppService } from "@/core/nutrition_care/application/services/next";

export class NutritionCareContext {
  private static instance: NutritionCareContext | null = null;
  private readonly dbConnection: IndexedDBConnection | null;
  private readonly expo: SQLiteDatabase | null;
  private readonly idGenerator: GenerateUniqueId;
  private readonly eventBus: IEventBus;

  // Infra Mappers
  private readonly appetiteTestRefInfraMapper: InfrastructureMapper<
    AppetiteTestRef,
    AppetiteTestReferencePersistenceDto
  >;
  private readonly complicationInfraMapper: InfrastructureMapper<
    Complication,
    ComplicationPersistenceDto
  >;
  private readonly medicineInfraMapper: InfrastructureMapper<
    Medicine,
    MedicinePersistenceDto
  >;
  private readonly nextMedicineInfraMapper: InfrastructureMapper<
    NextNutritionCare.Medicine,
    NextNutritionCareInfra.MedicinePersistenceDto
  >;
  private readonly nextNutritionalProductInfraMapper: InfrastructureMapper<
    NextNutritionCare.NutritionalProduct,
    NextNutritionCareInfra.NutritionalProductPersistenceDto
  >;
  private readonly nextMilkInfraMapper: InfrastructureMapper<
    NextNutritionCare.Milk,
    NextNutritionCareInfra.MilkPersistenceDto
  >;
  private readonly nextOrientationRefInfraMapper: InfrastructureMapper<
    NextNutritionCare.OrientationReference,
    NextNutritionCareInfra.OrientationReferencePersistenceDto
  >;
  private readonly nextCarePhaseInfraMapper: InfrastructureMapper<
    NextCore.CarePhase,
    NextNutritionCareInfra.CarePhasePersistenceDto,
    NextNutritionCareInfra.CarePhasePersistenceRecordDto
  >;
  private readonly nextDailyCareActionInfraMapper: InfrastructureMapper<
    NextCore.DailyCareAction,
    NextNutritionCareInfra.DailyCareActionPersistenceDto
  >;
  private readonly nextDailyMonitoringTaskInfraMapper: InfrastructureMapper<
    NextCore.DailyMonitoringTask,
    NextNutritionCareInfra.DailyMonitoringTaskPersistenceDto
  >;
  private readonly nextDailyCareRecordInfraMapper: InfrastructureMapper<
    NextCore.DailyCareRecord,
    NextNutritionCareInfra.DailyCareRecordPersistenceDto,
    NextNutritionCareInfra.DailyCareRecordPersistenceRecordDto
  >;
  private readonly nextMessageInfraMapper: InfrastructureMapper<
    NextCore.Message,
    NextNutritionCareInfra.MessagePersistenceDto
  >;
  private readonly nextMonitoringParameterInfraMapper: InfrastructureMapper<
    NextCore.MonitoringParameter,
    NextNutritionCareInfra.MonitoringParameterPersistenceDto
  >;
  private readonly nextOnGoingTreatmentInfraMapper: InfrastructureMapper<
    NextCore.OnGoingTreatment,
    NextNutritionCareInfra.OnGoingTreatmentPersistenceDto
  >;
  private readonly nextPatientCareSessionInfraMapper: InfrastructureMapper<
    NextCore.PatientCareSession,
    NextNutritionCareInfra.PatientCareSessionAggregatePersistenceDto,
    NextNutritionCareInfra.PatientCareSessionAggregatePersistenceRecordDto
  >;
  private readonly carePhaseReferenceInfraMapper: InfrastructureMapper<
    CarePhaseReference, CarePhaseReferencePersistenceDto, CarePhaseReferencePersistenceRecordDto>;
  private readonly recommendedTreatmentInfraMapper: InfrastructureMapper<RecommendedTreatment, RecommendedTreatmentPersistenceDto>;
  private readonly monitoringElementInfraMapper: InfrastructureMapper<MonitoringElement, MonitoringElementPersistenceDto>;
  private readonly milkInfraMapper: InfrastructureMapper<
    Milk,
    MilkPersistenceDto
  >;
  private readonly orientationRefInfraMapper: InfrastructureMapper<
    OrientationReference,
    OrientationReferencePersistenceDto
  >;
  private readonly dailyCareJournalInfraMapper: InfrastructureMapper<
    DailyCareJournal,
    DailyJournalPersistenceDto
  >;
  private readonly patientCurrentStateInfraMapper: InfrastructureMapper<
    PatientCurrentState,
    PatientCurrentStatePersistenceDto
  >;
  private readonly patientCareSessionInfraMapper: InfrastructureMapper<
    PatientCareSession,
    PatientCareSessionPersistenceDto
  >;

  // Repositories
  private readonly appetiteTestRefRepo: AppetiteTestRefRepository;
  private readonly complicationRepo: ComplicationRepository;
  private readonly medicineRepo: MedicineRepository;
  private readonly nextMedicineRepo: NextNutritionCare.MedicineRepository;
  private readonly nextNutritionalProductRepo: NextNutritionCare.NutritionalProductRepository;
  private readonly nextMilkRepo: NextNutritionCare.MilkRepository;
  private readonly nextOrientationRefRepo: NextNutritionCare.OrientationReferenceRepository;
  private readonly carePhaseReferenceRepo: CarePhaseReferenceRepository;
  private readonly recommendedTreatmentRepo: RecommendedTreatmentRepository;
  private readonly monitoringElementRepo: MonitoringElementRepository;
  // Next Core Repositories
  private readonly nextCarePhaseRepo: NextCore.CarePhaseRepository;
  private readonly nextDailyCareActionRepo: NextCore.DailyCareActionRepository;
  private readonly nextDailyMonitoringTaskRepo: NextCore.DailyMonitoringTaskRepository;
  private readonly nextDailyCareRecordRepo: NextCore.DailyCareRecordRepository;
  private readonly nextMessageRepo: NextCore.CareMessageRepository;
  private readonly nextMonitoringParameterRepo: NextCore.MonitoringParameterRepository;
  private readonly nextOnGoingTreatmentRepo: NextCore.OnGoingTreatmentRepository;
  private readonly nextPatientCareSessionRepo: NextCore.PatientCareSessionRepository;
  private readonly milkRepo: MilkRepository;
  private readonly orientationRepo: OrientationReferenceRepository;
  private readonly dailyCareJournalRepo: DailyCareJournalRepository;
  private readonly patientCurrentStateRepo: PatientCurrentStateRepository;
  private readonly patientCareSessionRepo: PatientCareSessionRepository;

  // Domain Services
  private readonly therapeuticMilkService: ITherapeuticMilkAdvisorService;
  private readonly orientationService: IOrientationService;
  private readonly appetiteTestService: IAppetiteTestService;
  private readonly patientDailyJournalGenerator: IPatientDailyJournalGenerator;
  private readonly medicineDosageService: IMedicineDosageService;
  private readonly carePhaseReferenceOrchestrator: ICarePhaseReferenceOrchestrator;
  private readonly recommendedTreatmentService: IRecommendedTreatmentService
  // Next domain services
  private nextMedicineService: NextNutritionCare.IMedicationDosageCalculator;
  private nextNutritionalProductService: NextNutritionCare.INutritionalProductAdvisorService;
  private nextNutritionalProductAdvisorService: NextNutritionCare.INutritionalProductAdvisorService;
  private nextOrientationService: NextNutritionCare.IOrientationService;
  // Next core
  private readonly nextCarePhaseDailyCareRecordManager: NextCore.ICarePhaseDailyCareRecordManager;
  private readonly nextCarePlanApplicatorService: NextCore.ICarePlanApplicatorService;
  private readonly nextCareSessionVariableGenerator: NextCore.ICareSessionVariableGeneratorService;
  private readonly nextDailyActionGeneratorService: NextCore.IDailyActionGeneratorService;
  private readonly nextDailyPlanGeneratorService: NextCore.IDailyPlanGeneratorService;
  private readonly nextDailyPlanApplicatorService: NextCore.IDailyPlanApplicatorService;
  private readonly nextDailyScheduleService: NextCore.IDailyScheduleService;
  private readonly nextDailyTaskGeneratorService: NextCore.DailyTaskGeneratorService;
  private readonly nextPatientOrchestratorService: NextCore.IPatientCareOrchestratorService;
  private readonly nextPatientCarePhaseManagerService: NextCore.ICarePhaseManagerService;
  private readonly nextTreatmentDateManagementService: NextCore.ITreatmentDateManagementService;
  private readonly nextPatientOrchestratorPort: NextCore.IPatientCareOrchestratorPort;
  // Domain Factories
  private readonly patientCareSessionFactory: Factory<
    CreatePatientCareSessionProps,
    PatientCareSession
  >;
  private readonly carePhaseReferenceFactory: Factory<
    CreateCarePhaseReference,
    CarePhaseReference
  >;

  // Application Mappers
  private readonly appetiteTestAppMapper: AppetiteTestReferenceMapper;
  private readonly complicationAppMapper: ComplicationMapper;
  private readonly medicineAppMapper: MedicineMapper;
  private readonly nextMedicineAppMapper: NextMedicinesMapper.MedicineMapper;
  private readonly nextMedicineDosageResultAppMapper: NextMedicinesMapper.MedicationDosageResultMapper;
  private readonly nextOrientationAppMapper: NextOrientationAppMapper.OrientationReferenceMapper;
  private readonly carePhaseReferenceAppMapper: ApplicationMapper<CarePhaseReference, CarePhaseReferenceDto>;
  // Next module app mappers
  private readonly nextNutritionalProductAppMapper: NextNutritionalProductMapper.NutritionalProductMapper;
  private readonly nextNutritionalProductDosageAppMapper: NextNutritionalProductMapper.NutritionalProductDosageMapper;
  private readonly nextMilkAppMapper: NextMilkMapper.MilkMapper;
  private readonly milkAppMapper: MilkMapper;
  private readonly orientationAppMapper: OrientationRefMapper;
  private readonly patientCurrentStateAppMapper: PatientCurrentStateMapper;
  private readonly dailyJournalAppMapper: DailyCareJournalMapper;
  private readonly carePhaseAppMapper: CarePhaseMapper;
  private readonly patientCareSessionAppMapper: PatientCareSessionMapper;
  // Next core app mappers ;
  private readonly nextCarePhaseMapper: ApplicationMapper<NextCore.CarePhase,NextCoreDtos.CarePhaseDto>;
  private readonly nextDailyCareRecordMapper: ApplicationMapper<NextCore.DailyCareRecord,NextCoreDtos.DailyCareRecordDto>;
  private readonly nextMessageMapper: ApplicationMapper<NextCore.Message, NextCoreDtos.MessageDto>;
  private readonly nextPatientCareSessionMapper: ApplicationMapper<NextCore.PatientCareSession , NextCoreDtos.PatientCareSessionAggregateDto>;
  // Use Cases
  private readonly createAppetiteTestRefUC: UseCase<
    CreateAppetiteTestRequest,
    CreateAppetiteTestResponse
  >;
  private readonly getAppetiteTestRefUC: UseCase<
    GetAppetiteTestRequest,
    GetAppetiteTestResponse
  >;
  private readonly evaluateAppetiteUC: UseCase<
    EvaluateAppetiteRequest,
    EvaluateAppetiteResponse
  >;
  private readonly createComplicationUC: UseCase<
    CreateComplicationRequest,
    CreateComplicationResponse
  >;
  private readonly getComplicationUC: UseCase<
    GetComplicationRequest,
    GetComplicationResponse
  >;
  private readonly createMedicineUC: UseCase<
    CreateMedicineRequest,
    CreateMedicineResponse
  >;
  private readonly getMedicineUC: UseCase<
    GetMedicineRequest,
    GetMedicineResponse
  >;
  private readonly getMedicineDosageUC: UseCase<
    GetMedicineDosageRequest,
    GetMedicineDosageResponse
  >;
  private readonly nextCreateMedicineUC: UseCase<
    NextMedicinesUseCases.CreateMedicineRequest,
    NextMedicinesUseCases.CreateMedicineResponse
  >;
  private readonly nextGetMedicineUC: UseCase<
    NextMedicinesUseCases.GetMedicineRequest,
    NextMedicinesUseCases.GetMedicineResponse
  >;
  private readonly nextGetMedicineDosageUC: UseCase<
    NextMedicinesUseCases.GetMedicineDosageRequest,
    NextMedicinesUseCases.GetMedicineDosageResponse
  >;
  private readonly createCarePhaseReferenceUC: UseCase<
    CreateCarePhaseReferenceRequest,
    CreateCarePhaseReferenceResponse
  >;
  private readonly getCarePhaseReferenceUC: UseCase<
    GetCarePhaseReferenceRequest,
    GetCarePhaseReferenceResponse
  >;
  // Next module use cases
  private readonly nextCreateNutritionalProductUC: UseCase<
    NextNutritionalProductUseCases.CreateNutritionalProductRequest,
    NextNutritionalProductUseCases.CreateNutritionalProductResponse
  >;
  private readonly nextGetNutritionalProductUC: UseCase<
    NextNutritionalProductUseCases.GetNutritionalProductRequest,
    NextNutritionalProductUseCases.GetNutritionalProductResponse
  >;
  private readonly nextEvaluateNutritionalProductUC: UseCase<
    NextNutritionalProductUseCases.EvaluateNutritionalProductRequest,
    NextNutritionalProductUseCases.EvaluateNutritionalProductResponse
  >;
  private readonly nextGetNutritionalProductDosageUC: UseCase<
    NextNutritionalProductUseCases.GetNutritionalProductDosageRequest,
    NextNutritionalProductUseCases.GetNutritionalProductDosageResponse
  >;
  private readonly nextCreateMilkUC: UseCase<
    NextMilkUseCases.CreateMilkRequest,
    NextMilkUseCases.CreateMilkResponse
  >;
  private readonly nextGetMilkUC: UseCase<
    NextMilkUseCases.GetMilkRequest,
    NextMilkUseCases.GetMilkResponse
  >;
  private readonly nextCreateOrientationRefUC: UseCase<
    NextOrientationUseCases.CreateOrientationReferenceRequest,
    NextOrientationUseCases.CreateOrientationReferenceResponse
  >;
  private readonly nextUpdateOrientationRefUC: UseCase<
    NextOrientationUseCases.UpdateOrientationReferenceRequest,
    NextOrientationUseCases.UpdateOrientationReferenceResponse
  >;
  private readonly nextGetOrientationRefUC: UseCase<
    NextOrientationUseCases.GetOrientationReferenceRequest,
    NextOrientationUseCases.GetOrientationReferenceResponse
  >;
  private readonly nextOrientUC: UseCase<
    NextOrientationUseCases.OrientRequest,
    NextOrientationUseCases.OrientResponse
  >;
  // Next Core UseCases ...
  private readonly nextGetMessageUC: UseCase<NextCoreUseCases.GetCareMessageRequest, NextCoreUseCases.GetCareMessageResponse>;
  private readonly nextGetPendingMessagesUC: UseCase<NextCoreUseCases.GetPendingMessagesRequest, NextCoreUseCases.GetPendingMessagesResponse>;
  private readonly nextSubmitUserResponseUC: UseCase<NextCoreUseCases.SubmitUserResponseRequest, NextCoreUseCases.SubmitUserResponseResponse>;
  private readonly nextCompleteActionUC: UseCase<NextCoreUseCases.CompleteActionRequest, NextCoreUseCases.CompleteActionResponse>;
  private readonly nextCompleteTaskUC: UseCase<NextCoreUseCases.CompleteTaskRequest, NextCoreUseCases.CompleteTaskResponse>;
  private readonly nextHandleCompletionResponseUC: UseCase<NextCoreUseCases.HandleCompletionResponseRequest, NextCoreUseCases.HandleCompletionResponseResponse>;
  private readonly nextMarkRecordIncompleteUC: UseCase<NextCoreUseCases.MarkRecordIncompleteRequest, NextCoreUseCases.MarkRecordIncompleteResponse>;
  private readonly nextGetDailyCareActionUC: UseCase<NextCoreUseCases.GetDailyCareActionRequest, NextCoreUseCases.GetDailyCareActionResponse>;
  private readonly nextGetDailyCareRecordUC: UseCase<NextCoreUseCases.GetDailyCareRecordRequest, NextCoreUseCases.GetDailyCareRecordResponse>;
  private readonly nextGetDailyMonitoringTaskUC: UseCase<NextCoreUseCases.GetDailyMonitoringTaskRequest, NextCoreUseCases.GetDailyMonitoringTaskResponse>;
  private readonly nextGetMonitoringParameterUC: UseCase<NextCoreUseCases.GetMonitoringParameterRequest, NextCoreUseCases.GetMonitoringParameterResponse>;
  private readonly nextGetOnGoingTreatmentUC: UseCase<NextCoreUseCases.GetOnGoingTreatmentRequest, NextCoreUseCases.GetOnGoingTreatmentResponse>;
  private readonly nextGenerateDailyCarePlanUC: UseCase<NextCoreUseCases.GenerateDailyCarePlanRequest, NextCoreUseCases.GenerateDailyCarePlanResponse>;
  private readonly nextStartContinuousOrchestrationUC: UseCase<NextCoreUseCases.StartContinuousOrchestrationRequest, NextCoreUseCases.StartContinuousOrchestrationResponse>;
  private readonly nextSynchronizePatientStateUC: UseCase<NextCoreUseCases.SynchronizePatientStateRequest, NextCoreUseCases.SynchronizePatientStateResponse>;
  private readonly nextCreatePatientCareSessionUC: UseCase<NextCoreUseCases.CreatePatientCareSessionRequest, NextCoreUseCases.CreatePatientCareSessionResponse>;
  private readonly nextGetPatientCareSessionStateUC: UseCase<NextCoreUseCases.GetPatientCareSessionStatusRequest, NextCoreUseCases.GetPatientCareSessionStatusResponse>;
  private readonly nextGetPatientCareSessionUC: UseCase<NextCoreUseCases.GetPatientCareSessionRequest, NextCoreUseCases.GetPatientCareSessionResponse>;

  private readonly createMilkUC: UseCase<CreateMilkRequest, CreateMilkResponse>;
  private readonly getMilkUC: UseCase<GetMilkRequest, GetMilkResponse>;
  private readonly suggestMilkUC: UseCase<
    SuggestMilkRequest,
    SuggestMilkResponse
  >;
  private readonly createOrientationRefUC: UseCase<
    CreateOrientationRefRequest,
    CreateOrientationRefResponse
  >;
  private readonly getOrientationRefUC: UseCase<
    GetOrientationRefRequest,
    GetOrientationRefResponse
  >;
  private readonly orientUC: UseCase<OrientRequest, OrientResponse>;
  private readonly createPatientCareSessionUC: UseCase<
    CreatePatientCareSessionRequest,
    CreatePatientCareSessionResponse
  >;
  private readonly getPatientCareSessionUC: UseCase<
    GetPatientCareSessionRequest,
    GetPatientCareSessionResponse
  >;
  private readonly addDataUC: UseCase<
    AddDataToPatientCareSessionRequest,
    AddDataToPatientCareSessionResponse
  >;
  private readonly evaluatePatientAppetiteUC: UseCase<
    EvaluatePatientAppetiteRequest,
    EvaluatePatientAppetiteResponse
  >;
  private readonly orientPatientUC: UseCase<
    OrientPatientRequest,
    OrientPatientResponse
  >;
  private readonly makeCareSessionReadyUC: UseCase<
    MakePatientCareSessionReadyRequest,
    MakePatientCareSessionReadyResponse
  >;
  private readonly getDailyJournalsUC: UseCase<
    GetDailyJournalRequest,
    GetDailyJouranlResponse
  >;

  // Application Service
  private readonly appetiteTestAppService: IAppetiteTestAppService;
  private readonly complicationAppService: IComplicationAppService;
  private readonly medicineAppService: IMedicineAppService;
  private readonly nextMedicineAppService: NextNutritionCareAppService.IMedicineAppService;
  private readonly carePhaseReferenceAppService: ICarePhaseReferenceAppService;
  // Next module app services
  private readonly nextNutritionalProductAppService: NextNutritionCareAppService.NutritionalProductService;
  private readonly nextMilkAppService: NextNutritionCareAppService.MilkService;
  private readonly nextOrientationAppService: NextNutritionCareAppService.OrientationService;
  private readonly milkAppService: IMilkAppService;
  private readonly orientationAppService: IOrientationAppService;
  private readonly patientCareSessionAppService: IPatientCareSessionAppService;
  // Next Core app services ... 
  private readonly nextCommunicationAppService: ICommunicationService;
  private readonly nextCompletionAppService: ICompletionService;
  private readonly nextDailyCareActionAppService: IDailyCareActionService;
  private readonly nextDailyRecordAppService: IDailyCareRecordService;
  private readonly nextDailyMonitoringTaskAppService: IDailyMonitoringTaskService;
  private readonly nextMonitoringParameterAppService: IMonitoringParameterService;
  private readonly nextOnGoingTreatmentAppService: IOnGoingTreatmentService;
  private readonly nextOrchestrationAppService: IOrchestrationService;
  private readonly nextPatientCareSessionAppService: IPatientCareSessionServiceNext;
  // ACL
  private readonly patientAcl: PatientACLImpl;
  private readonly computedVariablePerformerAcl: IComputedVariablePerformerACL;
  private readonly medicalRecordVariableTransformerAcl: NextCore.MedicalRecordVariableTransformerAcl;
  // Subscribers
  private readonly afterPatientGlobalPerformedHandler: AfterPatientGlobalVariablePerformedEvent;

  private constructor(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
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
    this.idGenerator = new GenerateUUID();
    this.eventBus = eventBus;

    // ACL
    this.patientAcl = new PatientACLImpl(
      PatientContext.init(dbConnection, expo, eventBus).getService()
    );
    this.computedVariablePerformerAcl = new ComputedVariablePerformerAcl(DiagnosticContext.init(dbConnection, expo, eventBus).getFormulaFieldService())
    this.medicalRecordVariableTransformerAcl = new MedicalRecordVariableTransformerAclImpl({
      growthIndicatorValuesService: DiagnosticContext.init(dbConnection, expo, eventBus).getGrowthIndicatorValueService(),
      medicalRecordService: MedicalRecordContext.init(dbConnection, expo, eventBus).getMedicalRecordService(),
      normalizeData: DiagnosticContext.init(dbConnection, expo, eventBus).getNormalizeDataService(),
      patientService: PatientContext.init(dbConnection, expo, eventBus).getService(),
    })

    // Infra Mappers
    this.appetiteTestRefInfraMapper = new AppetiteTestInfraMapper();
    this.complicationInfraMapper = new ComplicationInfraMapper();
    this.medicineInfraMapper = new MedicineInfraMapper();
    this.nextMedicineInfraMapper =
      new NextNutritionCareInfraMapper.MedicineInfraMapper();
    this.nextNutritionalProductInfraMapper =
      new NextNutritionCareInfraMapper.NutritionalProductInfraMapper();
    this.nextMilkInfraMapper =
      new NextNutritionCareInfraMapper.MilkInfraMapper();
    this.nextOrientationRefInfraMapper =
      new NextNutritionCareInfraMapper.OrientationReferenceInfraMapper();
    this.nextCarePhaseInfraMapper =
      new NextNutritionCareInfraMapper.CarePhaseInfraMapper();
    this.nextDailyCareActionInfraMapper =
      new NextNutritionCareInfraMapper.DailyCareActionInfraMapper();
    this.nextDailyMonitoringTaskInfraMapper =
      new NextNutritionCareInfraMapper.DailyMonitoringTaskInfraMapper();
    this.nextDailyCareRecordInfraMapper =
      new NextNutritionCareInfraMapper.DailyCareRecordInfraMapper();
    this.nextMessageInfraMapper =
      new NextNutritionCareInfraMapper.MessageInfraMapper();
    this.nextMonitoringParameterInfraMapper =
      new NextNutritionCareInfraMapper.MonitoringParameterInfraMapper();
    this.nextOnGoingTreatmentInfraMapper =
      new NextNutritionCareInfraMapper.OnGoingTreatmentInfraMapper();
    this.nextPatientCareSessionInfraMapper =
      new NextNutritionCareInfraMapper.PatientCareSessionAggregateInfraMapper();
    this.carePhaseReferenceInfraMapper = new CarePhaseReferenceInfraMapper();
    this.recommendedTreatmentInfraMapper = new RecommendedTreatmentInfraMapper();
    this.monitoringElementInfraMapper = new MonitoringElementInfraMapper();
    this.milkInfraMapper = new MilkInfraMapper();
    this.orientationRefInfraMapper = new OrientationReferenceInfraMapper();
    this.patientCurrentStateInfraMapper = new PatientCurrentStateInfraMapper();
    this.dailyCareJournalInfraMapper = new DailyCareJournalInfraMapper();
    this.patientCareSessionInfraMapper = new PatientCareSessionInfraMapper(
      this.patientCurrentStateInfraMapper,
      this.dailyCareJournalInfraMapper
    );

    // Repositories
    this.appetiteTestRefRepo = isWebEnv()
      ? new AppetiteTestRefRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.appetiteTestRefInfraMapper
      )
      : new AppetiteTestRefRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.appetiteTestRefInfraMapper,
        appetite_test_references,
        this.eventBus
      );
    this.complicationRepo = isWebEnv()
      ? new ComplicationRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.complicationInfraMapper
      )
      : new ComplicationRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.complicationInfraMapper,
        complications,
        this.eventBus
      );
    this.medicineRepo = isWebEnv()
      ? new MedicineRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.medicineInfraMapper
      )
      : new MedicineRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.medicineInfraMapper,
        medicines,
        this.eventBus
      );
    this.nextMedicineRepo = isWebEnv()
      ? (new NextNutritionCareRepoWeb.MedicineRepositoryWeb(
        this.dbConnection as IndexedDBConnection,
        this.nextMedicineInfraMapper
      ) as any) // FIX : this repo not have an exist method for web env
      : new NextNutritionCareRepoExpo.MedicineRepositoryExpo(
        this.expo as SQLiteDatabase,
        this.nextMedicineInfraMapper,
        next_medicines,
        this.eventBus
      );
    // Next module repositories
    this.nextNutritionalProductRepo = isWebEnv()
      ? new NextNutritionCareRepoWeb.NutritionalProductRepositoryWeb(
        this.dbConnection as IndexedDBConnection,
        this.nextNutritionalProductInfraMapper
      )
      : new NextNutritionCareRepoExpo.NutritionalProductRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextNutritionalProductInfraMapper,
        next_nutritional_products,
        this.eventBus
      );
    this.nextMilkRepo = isWebEnv()
      ? new NextNutritionCareRepoWeb.MilkRepositoryWeb(
        this.dbConnection as IndexedDBConnection,
        this.nextMilkInfraMapper
      )
      : new NextNutritionCareRepoExpo.MilkRepositoryExpo(
        this.expo as SQLiteDatabase,
        this.nextMilkInfraMapper,
        next_milks,
        this.eventBus
      );
    this.nextOrientationRefRepo = isWebEnv()
      ? new NextNutritionCareRepoWeb.OrientationReferenceRepositoryWeb(
        this.dbConnection as IndexedDBConnection,
        this.nextOrientationRefInfraMapper
      )
      : new NextNutritionCareRepoExpo.OrientationReferenceRepositoryExpo(
        this.expo as SQLiteDatabase,
        this.nextOrientationRefInfraMapper,
        next_orientation_references,
        this.eventBus
      );

    this.nextMonitoringParameterRepo =
      new NextNutritionCareRepoExpo.MonitoringParameterRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextMonitoringParameterInfraMapper,
        monitoring_parameters,
        this.eventBus
      );
    this.nextOnGoingTreatmentRepo =
      new NextNutritionCareRepoExpo.OnGoingTreatmentRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextOnGoingTreatmentInfraMapper,
        on_going_treatments,
        this.eventBus
      );
    this.nextCarePhaseRepo =
      new NextNutritionCareRepoExpo.CarePhaseRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextCarePhaseInfraMapper,
        care_phases,
        this.nextMonitoringParameterRepo,
        this.nextOnGoingTreatmentRepo,
        this.eventBus
      );
    this.nextDailyCareActionRepo =
      new NextNutritionCareRepoExpo.DailyCareActionRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextDailyCareActionInfraMapper,
        daily_care_actions,
        this.eventBus
      );
    this.nextDailyMonitoringTaskRepo =
      new NextNutritionCareRepoExpo.DailyMonitoringTaskRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextDailyMonitoringTaskInfraMapper,
        daily_monitoring_tasks,
        this.eventBus
      );
    this.nextDailyCareRecordRepo =
      new NextNutritionCareRepoExpo.DailyCareRecordRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextDailyCareRecordInfraMapper,
        daily_care_records,
        this.nextDailyCareActionRepo,
        this.nextDailyMonitoringTaskRepo,
        this.eventBus
      );
    this.nextMessageRepo =
      new NextNutritionCareRepoExpo.MessageRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextMessageInfraMapper,
        messages,
        this.eventBus
      );
    this.nextPatientCareSessionRepo =
      new NextNutritionCareRepoExpo.PatientCareSessionRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nextPatientCareSessionInfraMapper,
        patient_care_session_aggregates,
        this.nextCarePhaseRepo,
        this.nextDailyCareRecordRepo,
        this.nextMessageRepo,
        this.eventBus
      );
    this.recommendedTreatmentRepo = isWebEnv() ? new RecommendedTreatmentRepositoryWeb(
      this.dbConnection as IndexedDBConnection,
      this.recommendedTreatmentInfraMapper,
      this.eventBus
    ) : new RecommendedTreatmentRepositoryExpo(
      this.expo as SQLiteDatabase,
      this.recommendedTreatmentInfraMapper,
      recommended_treatments,
      this.eventBus
    )
    this.monitoringElementRepo = isWebEnv() ? new MonitoringElementRepositoryWeb(
      this.dbConnection as IndexedDBConnection,
      this.monitoringElementInfraMapper,
      this.eventBus
    ) : new MonitoringElementRepositoryExpo(
      this.expo as SQLiteDatabase,
      this.monitoringElementInfraMapper,
      monitoring_elements,
      this.eventBus
    )
    this.carePhaseReferenceRepo = isWebEnv() ? new CarePhaseReferenceRepositoryWeb(
      this.dbConnection as IndexedDBConnection,
      this.carePhaseReferenceInfraMapper as any,
      this.eventBus
    ) : new CarePhaseReferenceRepositoryExpo(
      this.expo as SQLiteDatabase,
      this.carePhaseReferenceInfraMapper,
      care_phase_references,
      this.recommendedTreatmentRepo,
      this.monitoringElementRepo,
      this.eventBus

    );
    this.milkRepo = isWebEnv()
      ? new MilkRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.milkInfraMapper
      )
      : new MilkRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.milkInfraMapper,
        milks,
        this.eventBus
      );
    this.orientationRepo = isWebEnv()
      ? new OrientationReferenceRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.orientationRefInfraMapper
      )
      : new OrientationReferenceRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.orientationRefInfraMapper,
        orientation_references,
        this.eventBus
      );
    this.dailyCareJournalRepo = isWebEnv()
      ? new DailyCareJournalRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.dailyCareJournalInfraMapper
      )
      : new DailyCareJournalRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.dailyCareJournalInfraMapper,
        daily_care_journals,
        this.eventBus
      );
    this.patientCurrentStateRepo = isWebEnv()
      ? new PatientCurrentStateRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.patientCurrentStateInfraMapper
      )
      : new PatientCurrentStateRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.patientCurrentStateInfraMapper,
        patient_current_states,
        this.eventBus
      );
    this.patientCareSessionRepo = isWebEnv()
      ? new PatientCareSessionRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.patientCareSessionInfraMapper,
        this.eventBus
      )
      : new PatientCareSessionRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.patientCareSessionInfraMapper,
        patient_care_sessions,
        this.eventBus,
        {
          currentStateRepo: this.patientCurrentStateRepo,
          dailyJournalRepo: this.dailyCareJournalRepo,
        },
        {
          currentStateMapper: this.patientCurrentStateInfraMapper,
          dailyJournalRepo: this.dailyCareJournalInfraMapper,
        }
      );

    this.appetiteTestService = new AppetiteTestService(
      this.appetiteTestRefRepo
    );

    // Domain Services instantiation
    this.medicineDosageService = new MedicineDosageService();
    // Next module services
    this.nextMedicineService = new NextNutritionCare.MedicationDosageCalculator(
      this.nextMedicineRepo
    );
    this.nextNutritionalProductService =
      new NextNutritionCare.NutritionalProductAdvisorService(
        this.nextNutritionalProductRepo
      );
    this.nextNutritionalProductAdvisorService =
      new NextNutritionCare.NutritionalProductAdvisorService(
        this.nextNutritionalProductRepo
      );
    this.nextOrientationService = new NextNutritionCare.OrientationService(
      this.nextOrientationRefRepo
    );
    this.therapeuticMilkService = new TherapeuticMilkAdvisorService();
    this.orientationService = new OrientationService();
    this.patientDailyJournalGenerator = new PatientDailyJournalGenerator(
      this.idGenerator
    );
    this.carePhaseReferenceOrchestrator = new CarePhaseReferenceOrchestrator(this.carePhaseReferenceRepo, this.recommendedTreatmentRepo);
     this.recommendedTreatmentService = new RecommendedTreatmentService(this.recommendedTreatmentRepo);
    // Next Core Domain Services and helpers
    // Helpers 
    const dateCalculatorServiceHelper = new NextCore.DateCalculatorService();
    this.nextTreatmentDateManagementService = new NextCore.TreatmentDateManagementService(dateCalculatorServiceHelper);
    const treatmentManagerHelper = new NextCore.TreatmentManager(this.idGenerator,this.nextTreatmentDateManagementService);
    const monitoringParameterManagerHelper = new NextCore.MonitoringParameterManager(this.idGenerator,this.nextTreatmentDateManagementService);
    const triggersExecutorHelper = new NextCore.TriggerExecutor(this.recommendedTreatmentService,this.idGenerator);
    // Domain Services 
    this.nextCareSessionVariableGenerator = new NextCore.CareSessionVariableGeneratorService(this.computedVariablePerformerAcl,this.medicalRecordVariableTransformerAcl); 
    this.nextCarePlanApplicatorService = new NextCore.CarePlanApplicatorService(treatmentManagerHelper,monitoringParameterManagerHelper,triggersExecutorHelper)
    this.nextDailyScheduleService = new NextCore.DailyScheduleService(this.nextTreatmentDateManagementService);
    this.nextDailyActionGeneratorService = new NextCore.DailyActionGeneratorService(this.idGenerator,this.nextMedicineService,this.nextNutritionalProductAdvisorService);
    this.nextDailyTaskGeneratorService = new NextCore.DailyTaskGeneratorService(this.idGenerator);
    this.nextDailyPlanGeneratorService = new NextCore.DailyPlanGeneratorService(this.idGenerator,this.nextDailyScheduleService,this.nextDailyActionGeneratorService,this.nextDailyTaskGeneratorService);
    this.nextDailyPlanApplicatorService = new NextCore.DailyPlanApplicatorService()
    this.nextCarePhaseDailyCareRecordManager = new NextCore.CarePhaseDailyCareRecordManager(this.nextDailyPlanGeneratorService,this.nextDailyPlanApplicatorService,this.nextCareSessionVariableGenerator);
   this.nextPatientCarePhaseManagerService = new NextCore.CarePhaseManagerService(this.idGenerator,this.carePhaseReferenceOrchestrator,this.nextCareSessionVariableGenerator,this.nextCarePlanApplicatorService);
    this.nextPatientOrchestratorService = new NextCore.PatientCareOrchestratorService(this.idGenerator,this.nextPatientCarePhaseManagerService,this.nextCarePhaseDailyCareRecordManager);
    this.nextPatientOrchestratorPort = new NextCore.PatientCareOrchestratorPort(this.nextPatientOrchestratorService, this.nextPatientCareSessionRepo,this.idGenerator);
    // Domain Factories
    this.patientCareSessionFactory = new PatientCareSessionFactory(
      this.idGenerator,
      this.patientDailyJournalGenerator
    );
    this.carePhaseReferenceFactory = new CarePhaseReferenceFactory(this.idGenerator);

    // Application Mappers
    this.appetiteTestAppMapper = new AppetiteTestReferenceMapper();
    this.complicationAppMapper = new ComplicationMapper();
    this.medicineAppMapper = new MedicineMapper();
    this.nextMedicineAppMapper = new NextMedicinesMapper.MedicineMapper();
    this.nextMedicineDosageResultAppMapper =
      new NextMedicinesMapper.MedicationDosageResultMapper();
    this.carePhaseReferenceAppMapper = new CarePhaseRefMapper();
    // Next module app mappers
    this.nextNutritionalProductAppMapper =
      new NextNutritionalProductMapper.NutritionalProductMapper();
    this.nextNutritionalProductDosageAppMapper =
      new NextNutritionalProductMapper.NutritionalProductDosageMapper();
    this.nextMilkAppMapper = new NextMilkMapper.MilkMapper();
    this.nextOrientationAppMapper =
      new NextOrientationAppMapper.OrientationReferenceMapper();
    this.milkAppMapper = new MilkMapper();
    this.orientationAppMapper = new OrientationRefMapper();
    this.patientCurrentStateAppMapper = new PatientCurrentStateMapper();
    this.dailyJournalAppMapper = new DailyCareJournalMapper();
    this.carePhaseAppMapper = new CarePhaseMapper();
    this.patientCareSessionAppMapper = new PatientCareSessionMapper(
      this.carePhaseAppMapper,
      this.patientCurrentStateAppMapper,
      this.dailyJournalAppMapper
    );
    // Next Core app mappers
    this.nextCarePhaseMapper = new NextCoreMapper.CarePhaseMapper();
    this.nextDailyCareRecordMapper = new NextCoreMapper.DailyCareRecordMapper();
    this.nextMessageMapper = new NextCoreMapper.MessageMapper();
    this.nextPatientCareSessionMapper = new PatientCareSessionAggregateMapper(this.nextCarePhaseMapper,this.nextDailyCareRecordMapper,this.nextMessageMapper);
    
    // Use Cases
    this.createAppetiteTestRefUC = new CreateAppetiteTestUseCase(
      this.idGenerator,
      this.appetiteTestRefRepo
    );
    this.getAppetiteTestRefUC = new GetAppetiteTestUseCase(
      this.appetiteTestRefRepo,
      this.appetiteTestAppMapper
    );
    this.evaluateAppetiteUC = new EvaluateAppetiteUseCase(
      this.appetiteTestService
    );
    this.createComplicationUC = new CreateComplicationUseCase(
      this.idGenerator,
      this.complicationRepo
    );
    this.getComplicationUC = new GetComplicationUseCase(
      this.complicationRepo,
      this.complicationAppMapper
    );
    this.createOrientationRefUC = new CreateOrientationRefUseCase(
      this.idGenerator,
      this.orientationRepo
    );
    this.getOrientationRefUC = new GetOrientationRefUseCase(
      this.orientationRepo,
      this.orientationAppMapper
    );
    this.orientUC = new OrientUseCase(
      this.orientationRepo,
      this.orientationService
    );
    this.createPatientCareSessionUC = new CreatePatientCareSessionUseCase(
      this.patientCareSessionFactory,
      this.patientCareSessionRepo,
      this.patientAcl
    );
    this.getPatientCareSessionUC = new GetPatientCareSessionUseCase(
      this.patientCareSessionRepo,
      this.patientCareSessionAppMapper,
      this.patientDailyJournalGenerator
    );
    this.addDataUC = new AddDataToPatientCareSessionUseCase(
      this.patientCareSessionRepo,
      this.patientDailyJournalGenerator
    );
    this.orientPatientUC = new OrientPatientUseCase(
      this.orientUC,
      this.patientDailyJournalGenerator,
      this.patientCareSessionRepo
    );
    this.makeCareSessionReadyUC = new MakePatientCareSessionReadyUseCase(
      this.patientCareSessionRepo
    );
    this.evaluatePatientAppetiteUC = new EvaluatePatientAppetiteUseCase(
      this.evaluateAppetiteUC,
      this.patientDailyJournalGenerator,
      this.patientCareSessionRepo
    );
    this.getDailyJournalsUC = new GetDailyJournalUseCase(
      this.getPatientCareSessionUC
    );

    this.getMedicineDosageUC = new GetMedicineDosageUseCase(
      this.medicineRepo,
      this.medicineDosageService
    );

    this.getCarePhaseReferenceUC = new GetCarePhaseReferenceUseCase(
      this.carePhaseReferenceRepo,
      this.carePhaseReferenceAppMapper
    );
    this.createCarePhaseReferenceUC = new CreateCarePhaseReferenceUseCase(
      this.carePhaseReferenceRepo,
      this.carePhaseReferenceFactory
    );

    // Medicine use cases
    this.createMedicineUC = new CreateMedicineUseCase(
      this.idGenerator,
      this.medicineRepo
    );
    this.getMedicineUC = new GetMedicineUseCase(
      this.medicineRepo,
      this.medicineAppMapper
    );
    this.nextCreateMedicineUC = new NextMedicinesUseCases.CreateMedicineUseCase(
      this.idGenerator,
      this.nextMedicineRepo
    );
    this.nextGetMedicineUC = new NextMedicinesUseCases.GetMedicineUseCase(
      this.nextMedicineRepo,
      this.nextMedicineAppMapper
    );
    this.nextGetMedicineDosageUC =
      new NextMedicinesUseCases.GetMedicineDosageUseCase(
        this.nextMedicineService,
        this.nextMedicineDosageResultAppMapper
      );

    // Next nutritional product use cases
    this.nextCreateNutritionalProductUC =
      new NextNutritionalProductUseCases.CreateNutritionalProductUseCase(
        this.idGenerator,
        this.nextNutritionalProductRepo
      );
    this.nextGetNutritionalProductUC =
      new NextNutritionalProductUseCases.GetNutritionalProductUseCase(
        this.nextNutritionalProductRepo,
        this.nextNutritionalProductAppMapper
      );
    this.nextEvaluateNutritionalProductUC =
      new NextNutritionalProductUseCases.EvaluateNutritionalProductUseCase(
        this.nextNutritionalProductService,
        this.nextNutritionalProductDosageAppMapper
      );
    this.nextGetNutritionalProductDosageUC =
      new NextNutritionalProductUseCases.GetNutritionalProductDosageUseCase(
        this.nextNutritionalProductAdvisorService,
        this.nextNutritionalProductDosageAppMapper
      );

    // Next milk use cases
    this.nextCreateMilkUC = new NextMilkUseCases.CreateMilkUseCase(
      this.idGenerator,
      this.nextMilkRepo
    );
    this.nextGetMilkUC = new NextMilkUseCases.GetMilkUseCase(
      this.nextMilkRepo,
      this.nextMilkAppMapper
    );

    // Next orientation use cases
    this.nextCreateOrientationRefUC =
      new NextOrientationUseCases.CreateOrientationReferenceUseCase(
        this.idGenerator,
        this.nextOrientationRefRepo
      );
    this.nextUpdateOrientationRefUC =
      new NextOrientationUseCases.UpdateOrientationReferenceUseCase(
        this.nextOrientationRefRepo,
        this.nextOrientationAppMapper
      );
    this.nextGetOrientationRefUC =
      new NextOrientationUseCases.GetOrientationReferenceUseCase(
        this.nextOrientationRefRepo,
        this.nextOrientationAppMapper
      );
    this.nextOrientUC = new NextOrientationUseCases.OrientUseCase(
      this.nextOrientationService
    );

    // Milk use cases
    this.createMilkUC = new CreateMilkUseCase(this.idGenerator, this.milkRepo);
    this.getMilkUC = new GetMilkUseCase(this.milkRepo, this.milkAppMapper);
    this.suggestMilkUC = new SuggestMilkUseCase(
      this.milkRepo,
      this.therapeuticMilkService
    );
   // Next Core Modules;
  
    // Application Service
    this.appetiteTestAppService = new AppetiteTestAppService({
      createUC: this.createAppetiteTestRefUC,
      evaluateAppetiteUC: this.evaluateAppetiteUC,
      getUC: this.getAppetiteTestRefUC,
    });
    this.complicationAppService = new ComplicationAppService({
      createUC: this.createComplicationUC,
      getUC: this.getComplicationUC,
    });
    this.medicineAppService = new MedicineAppService({
      createUC: this.createMedicineUC,
      getDosageUC: this.getMedicineDosageUC,
      getUC: this.getMedicineUC,
    });
    this.nextMedicineAppService =
      new NextNutritionCareAppService.MedicineAppService({
        createUC: this.nextCreateMedicineUC,
        getDosageUC: this.nextGetMedicineDosageUC,
        getUC: this.nextGetMedicineUC,
      });
    this.carePhaseReferenceAppService = new CarePhaseReferenceAppService({
      createUC: this.createCarePhaseReferenceUC,
      getUC: this.getCarePhaseReferenceUC,
    })
    // Next module app services
    this.nextNutritionalProductAppService =
      new NextNutritionCareAppService.NutritionalProductService({
        createNutritionalProductUC: this.nextCreateNutritionalProductUC,
        getNutritionalProductUC: this.nextGetNutritionalProductUC,
        evaluateNutritionalProductUC: this.nextEvaluateNutritionalProductUC,
        getNutritionalProductDosageUC: this.nextGetNutritionalProductDosageUC,
      });
    this.nextMilkAppService = new NextNutritionCareAppService.MilkService({
      createMilkUC: this.nextCreateMilkUC,
      getMilkUC: this.nextGetMilkUC,
    });
    this.nextOrientationAppService =
      new NextNutritionCareAppService.OrientationService({
        createOrientationReferenceUC: this.nextCreateOrientationRefUC,
        getOrientationReferenceUC: this.nextGetOrientationRefUC,
        updateOrientationReferenceUC: this.nextUpdateOrientationRefUC,
        orientUC: this.nextOrientUC,
      });
    this.milkAppService = new MilkAppService({
      createUC: this.createMilkUC,
      getUC: this.getMilkUC,
      suggestMilkUC: this.suggestMilkUC,
    });
    this.orientationAppService = new OrientationAppService({
      createUC: this.createOrientationRefUC,
      getUC: this.getOrientationRefUC,
      orientUC: this.orientUC,
    });
    this.patientCareSessionAppService = new PatientCareSessionAppService({
      createUC: this.createPatientCareSessionUC,
      getUC: this.getPatientCareSessionUC,
      addDataUC: this.addDataUC,
      evaluatePatientAppetiteUC: this.evaluatePatientAppetiteUC,
      orientPatientUC: this.orientPatientUC,
      makeCareSessionReadyUC: this.makeCareSessionReadyUC,
      getDailyJournalsUC: this.getDailyJournalsUC,
    });

    // Subscribers
    this.afterPatientGlobalPerformedHandler =
      new AfterPatientGlobalVariablePerformedEvent(
        this.addDataUC,
        this.makeCareSessionReadyUC
      );
    this.eventBus.subscribe(this.afterPatientGlobalPerformedHandler);
  }

  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    if (!NutritionCareContext.instance) {
      this.instance = new NutritionCareContext(dbConnection, expo, eventBus);
    }
    return this.instance as NutritionCareContext;
  }
  getAppetiteTestService(): IAppetiteTestAppService {
    return this.appetiteTestAppService;
  }

  getComplicationService(): IComplicationAppService {
    return this.complicationAppService;
  }
  getMedicineService(): IMedicineAppService {
    return this.medicineAppService;
  }

  getNextMedicineService(): NextNutritionCareAppService.IMedicineAppService {
    return this.nextMedicineAppService;
  }

  getCarePhaseReferenceService(): ICarePhaseReferenceAppService {
    return this.carePhaseReferenceAppService;
  }
  // Next module app service getters (only application services are exposed)
  getNextNutritionalProductAppService(): NextNutritionCareAppService.NutritionalProductService | null {
    return this.nextNutritionalProductAppService;
  }

  getNextMilkAppService(): NextNutritionCareAppService.MilkService | null {
    return this.nextMilkAppService;
  }

  getNextOrientationAppService(): NextNutritionCareAppService.OrientationService | null {
    return this.nextOrientationAppService;
  }

  getMilkService(): IMilkAppService {
    return this.milkAppService;
  }

  getOrientationService(): IOrientationAppService {
    return this.orientationAppService;
  }

  getPatientCareSessionService(): IPatientCareSessionAppService {
    return this.patientCareSessionAppService;
  }

  // Méthode existante de nettoyage
  dispose(): void {
    this.eventBus.unsubscribe(this.afterPatientGlobalPerformedHandler);
    NutritionCareContext.instance = null;
  }
}
