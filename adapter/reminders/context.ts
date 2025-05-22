import { SQLiteDatabase } from "expo-sqlite";
import { GenerateUUID, IndexedDBConnection, isWebEnv } from "../shared";
import {
  ApplicationMapper,
  GenerateUniqueId,
  IEventBus,
  InfrastructureMapper,
  UseCase,
} from "@shared";
import {
  CreateReminderRequest,
  CreateReminderResponse,
  CreateReminderUseCase,
  DeleteReminderRequest,
  DeleteReminderResponse,
  DeleteReminderUseCase,
  GetReminderRequest,
  GetReminderResponse,
  GetReminderUseCase,
  IReminderAppService,
  IReminderNotificationService,
  Reminder,
  ReminderAppMapper,
  ReminderAppService,
  ReminderDto,
  ReminderRepository,
  UpdateReminderRequest,
  UpdateReminderResponse,
  UpdateReminderUseCase,
} from "@/core/reminders";
import {
  ReminderInfraMapper,
  ReminderPersistenceDto,
  ReminderRepositoryExpoImpl,
  ReminderRepositoryWebImpl,
  reminders,
} from "./infra";
import {
  OnReminderCreatedScheduleNotificationHandler,
  OnReminderDeletedCanceledNotificationHandler,
  OnReminderUpdatedScheduleNotificationHandler,
} from "./subscribers";
import ReminderNotificationService from "@services/Notification/Notification";

export class ReminderContext {
  private static instance: ReminderContext | null = null;
  private readonly dbConnection: IndexedDBConnection | null;
  private readonly expo: SQLiteDatabase | null;
  private readonly eventBus: IEventBus;
  private readonly idGenerator: GenerateUniqueId;
  private readonly reminderInfraMapper: InfrastructureMapper<
    Reminder,
    ReminderPersistenceDto
  >;
  private readonly reminderRepo: ReminderRepository;
  private readonly reminderNotificationService: IReminderNotificationService;
  private readonly reminderAppMapper: ApplicationMapper<Reminder, ReminderDto>;

  private readonly createReminderUC: UseCase<
    CreateReminderRequest,
    CreateReminderResponse
  >;
  private readonly getReminderUC: UseCase<
    GetReminderRequest,
    GetReminderResponse
  >;
  private readonly updateReminderUC: UseCase<
    UpdateReminderRequest,
    UpdateReminderResponse
  >;
  private readonly deleteReminderUC: UseCase<
    DeleteReminderRequest,
    DeleteReminderResponse
  >;

  private readonly reminderAppService: IReminderAppService;
  private readonly onCreatedReminderNotifcationHandler: OnReminderCreatedScheduleNotificationHandler;
  private readonly onUpdatedReminderNotifcationHandler: OnReminderUpdatedScheduleNotificationHandler;
  private readonly onDeletdReminderNotifcationHandler: OnReminderDeletedCanceledNotificationHandler;

  constructor(
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
    this.idGenerator = new GenerateUUID();
    this.reminderInfraMapper = new ReminderInfraMapper();
    this.reminderRepo = isWebEnv()
      ? new ReminderRepositoryWebImpl(
          this.dbConnection as IndexedDBConnection,
          this.reminderInfraMapper
        )
      : new ReminderRepositoryExpoImpl(
          this.expo as SQLiteDatabase,
          this.reminderInfraMapper,
          reminders,
          this.eventBus
        );
    this.reminderNotificationService = new ReminderNotificationService();
    this.reminderAppMapper = new ReminderAppMapper();
    this.createReminderUC = new CreateReminderUseCase(
      this.idGenerator,
      this.reminderRepo
    );
    this.getReminderUC = new GetReminderUseCase(
      this.reminderRepo,
      this.reminderAppMapper
    );
    this.updateReminderUC = new UpdateReminderUseCase(this.reminderRepo);
    this.deleteReminderUC = new DeleteReminderUseCase(this.reminderRepo);

    this.reminderAppService = new ReminderAppService({
      createUC: this.createReminderUC,
      getUC: this.getReminderUC,
      updateUC: this.updateReminderUC,
      deleteUC: this.deleteReminderUC,
    });

    // Subscribers
    this.onCreatedReminderNotifcationHandler =
      new OnReminderCreatedScheduleNotificationHandler(
        this.reminderNotificationService
      );
    this.onUpdatedReminderNotifcationHandler =
      new OnReminderUpdatedScheduleNotificationHandler(
        this.reminderNotificationService
      );
    this.onDeletdReminderNotifcationHandler =
      new OnReminderDeletedCanceledNotificationHandler(
        this.reminderNotificationService
      );
    this.eventBus.subscribe(this.onCreatedReminderNotifcationHandler);
    this.eventBus.subscribe(this.onUpdatedReminderNotifcationHandler);
    this.eventBus.subscribe(this.onDeletdReminderNotifcationHandler);
  }

  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    if (!this.instance) {
      this.instance = new ReminderContext(dbConnection, expo, eventBus);
    }
    return this.instance as ReminderContext;
  }
  getReminderService(): IReminderAppService {
    return this.reminderAppService;
  }

  dispose() {
    ReminderContext.instance = null;
  }
}
