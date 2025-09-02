import {
  ApplicationMapper,
  Factory,
  GenerateUniqueId,
  IEventBus,
  InfrastructureMapper,
  UseCase,
} from "@shared";

import * as Next from "@core/nutrition_care/domain/next";
import * as NextApp from "@core/nutrition_care/application/next";
import * as NextInfra from "./infra/next";

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
  CarePhaseDto,
  CarePhaseMapper,
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
} from "./infra";
import { SQLiteDatabase } from "expo-sqlite";

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
    Next.Medicine,
    NextInfra.MedicinePersistenceDto
  >;
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
  private readonly nextMedicineRepo: Next.MedicineRepository;
  private readonly milkRepo: MilkRepository;
  private readonly orientationRepo: OrientationReferenceRepository;
  private readonly dailyCareJournalRepo: DailyCareJournalRepository;
  private readonly patientCurrentStateRepo: PatientCurrentStateRepository;
  private readonly patientCareSessionRepo: PatientCareSessionRepository;

  // Domain Services
  private readonly appetiteTestService: IAppetiteTestService;
  private readonly medicineDosageService: IMedicineDosageService;
  private readonly nextMedicineDosageService: Next.IMedicineDosageService;
  private readonly therapeuticMilkService: ITherapeuticMilkAdvisorService;
  private readonly orientationService: IOrientationService;
  private readonly patientDailyJournalGenerator: IPatientDailyJournalGenerator;

  // Domain Factories
  private readonly patientCareSessionFactory: Factory<
    CreatePatientCareSessionProps,
    PatientCareSession
  >;

  // Application Mappers
  private readonly appetiteTestAppMapper: ApplicationMapper<
    AppetiteTestRef,
    AppetiteTestRefDto
  >;
  private readonly complicationAppMapper: ApplicationMapper<
    Complication,
    ComplicationDto
  >;
  private readonly medicineAppMapper: ApplicationMapper<Medicine, MedicineDto>;
  private readonly nextMedicineAppMapper: ApplicationMapper<
    Next.Medicine,
    NextApp.MedicineDto
  >;
  private readonly milkAppMapper: ApplicationMapper<Milk, MilkDto>;
  private readonly orientationAppMapper: ApplicationMapper<
    OrientationReference,
    OrientationRefDto
  >;
  private readonly patientCurrentStateAppMapper: ApplicationMapper<
    PatientCurrentState,
    PatientCurrentStateDto
  >;
  private readonly patientCareSessionAppMapper: ApplicationMapper<
    PatientCareSession,
    PatientCareSessionDto
  >;
  private readonly carePhaseAppMapper: ApplicationMapper<
    CarePhase,
    CarePhaseDto
  >;
  private readonly dailyJournalAppMapper: ApplicationMapper<
    DailyCareJournal,
    DailyCareJournalDto
  >;

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
    NextApp.CreateMedicineRequest,
    NextApp.CreateMedicineResponse
  >;
  private readonly nextGetMedicineUC: UseCase<
    NextApp.GetMedicineRequest,
    NextApp.GetMedicineResponse
  >;
  private readonly nextGetMedicineDosageUC: UseCase<
    NextApp.GetMedicineDosageRequest,
    NextApp.GetMedicineDosageResponse
  >;
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
  private readonly nextMedicineAppService: NextApp.IMedicineAppService;
  private readonly milkAppService: IMilkAppService;
  private readonly orientationAppService: IOrientationAppService;
  private readonly patientCareSessionAppService: IPatientCareSessionAppService;

  // ACL
  private readonly patientAcl: PatientACLImpl;
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

    // Infra Mappers
    this.appetiteTestRefInfraMapper = new AppetiteTestInfraMapper();
    this.complicationInfraMapper = new ComplicationInfraMapper();
    this.medicineInfraMapper = new MedicineInfraMapper();
    this.nextMedicineInfraMapper = new NextInfra.MedicineInfraMapper();
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
      ? new NextInfra.MedicineRepositoryWebImpl(
          this.dbConnection as IndexedDBConnection,
          this.nextMedicineInfraMapper
        )
      : new NextInfra.MedicineRepositoryExpoImpl(
          this.expo as SQLiteDatabase,
          this.nextMedicineInfraMapper,
          NextInfra.medicines,
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

    // Domain Services
    this.appetiteTestService = new AppetiteTestService(
      this.appetiteTestRefRepo
    );
    this.medicineDosageService = new MedicineDosageService();
    this.nextMedicineDosageService = new Next.MedicineDosageService();
    this.therapeuticMilkService = new TherapeuticMilkAdvisorService();
    this.orientationService = new OrientationService();
    this.patientDailyJournalGenerator = new PatientDailyJournalGenerator(
      this.idGenerator
    );

    // Domain Factories
    this.patientCareSessionFactory = new PatientCareSessionFactory(
      this.idGenerator,
      this.patientDailyJournalGenerator
    );

    // Application Mappers
    this.appetiteTestAppMapper = new AppetiteTestReferenceMapper();
    this.complicationAppMapper = new ComplicationMapper();
    this.medicineAppMapper = new MedicineMapper();
    this.nextMedicineAppMapper = new NextApp.MedicineMapper();
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
    this.createMedicineUC = new CreateMedicineUseCase(
      this.idGenerator,
      this.medicineRepo
    );
    this.getMedicineUC = new GetMedicineUseCase(
      this.medicineRepo,
      this.medicineAppMapper
    );
    this.getMedicineDosageUC = new GetMedicineDosageUseCase(
      this.medicineRepo,
      this.medicineDosageService
    );
    this.nextCreateMedicineUC = new NextApp.CreateMedicineUseCase(
      this.idGenerator,
      this.nextMedicineRepo
    );
    this.nextGetMedicineUC = new NextApp.GetMedicineUseCase(
      this.nextMedicineRepo,
      this.nextMedicineAppMapper
    );
    this.nextGetMedicineDosageUC = new NextApp.GetMedicineDosageUseCase(
      this.nextMedicineRepo,
      this.nextMedicineDosageService
    );
    this.createMilkUC = new CreateMilkUseCase(this.idGenerator, this.milkRepo);
    this.getMilkUC = new GetMilkUseCase(this.milkRepo, this.milkAppMapper);
    this.suggestMilkUC = new SuggestMilkUseCase(
      this.milkRepo,
      this.therapeuticMilkService
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
    this.nextMedicineAppService = new NextApp.MedicineAppService({
      createUC: this.nextCreateMedicineUC,
      getDosageUC: this.nextGetMedicineDosageUC,
      getUC: this.nextGetMedicineUC,
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

  getNextMedicineService(): NextApp.IMedicineAppService {
    return this.nextMedicineAppService;
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
