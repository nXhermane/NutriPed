import { IEventBus } from "@shared";
import { IndexedDBConnection, GenerateUUID } from "../shared";
import { UnitInfraMapper, UnitRepositoryWebImpl } from "./infra";
import { UnitMapper, UnitConverterService, CreateUnitUseCase, GetUnitUseCase, UpdateUnitUseCase, DeleteUnitUseCase, ConvertUnitUseCase, UnitService } from "@core/units";


export class UnitContext {
   private static instance: UnitContext | null = null;
   private readonly dbConnection: IndexedDBConnection;
   private readonly eventBus: IEventBus;
   private readonly infraMapper: UnitInfraMapper;
   private readonly repository: UnitRepositoryWebImpl;
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

   private constructor(dbConnection: IndexedDBConnection, eventBus: IEventBus) {
      // Infrastructure
      this.dbConnection = dbConnection;
      this.eventBus = eventBus;
      this.infraMapper = new UnitInfraMapper();
      this.repository = new UnitRepositoryWebImpl(this.dbConnection, this.infraMapper, this.eventBus);

      // Application
      this.applicationMapper = new UnitMapper();
      this.converterService = new UnitConverterService();

      // Use Cases
      this.createUseCase = new CreateUnitUseCase(new GenerateUUID(), this.repository);
      this.getUseCase = new GetUnitUseCase(this.repository, this.applicationMapper);
      this.updateUseCase = new UpdateUnitUseCase(this.repository);
      this.deleteUseCase = new DeleteUnitUseCase(this.repository);
      this.convertUseCase = new ConvertUnitUseCase(this.repository, this.converterService);
   
      // Service
      this.service = new UnitService({
         createUC: this.createUseCase,
         getUC: this.getUseCase,
         updateUC: this.updateUseCase,
         deleteUC: this.deleteUseCase,
         convertUC: this.convertUseCase,
      });
   }
   static init(dbConnection: IndexedDBConnection, eventBus: IEventBus) {
      if (!UnitContext.instance) {
         this.instance = new UnitContext(dbConnection, eventBus);
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
