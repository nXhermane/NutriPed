import {
  ApplicationMapper,
  Factory,
  GenerateUniqueId,
  IEventBus,
  InfrastructureMapper,
  UseCase,
} from "@shared";
import {
  AddNoteToNutritionalDiagnosticRequest,
  AddNoteToNutritionalDiagnosticResponse,
  AddNoteToNutritionalDiagnosticUseCase,
  AgeBasedStrategy,
  AnthroComputingHelper,
  AnthropometricMeasure,
  AnthropometricMeasureDto,
  AnthropometricMeasureMapper,
  AnthropometricMeasureRepository,
  AnthropometricMeasureService,
  AnthropometricValidationService,
  AnthropometricVariableGeneratorService,
  BiochemicalReference,
  BiochemicalReferenceDto,
  BiochemicalReferenceMapper,
  BiochemicalReferenceRepository,
  BiochemicalReferenceService,
  BiologicalAnalysisAppService,
  BiologicalInterpretationService,
  BiologicalValidationService,
  BiologicalVariableGeneratorService,
  CalculateAllAvailableGrowthIndicatorValueRequest,
  CalculateAllAvailableGrowthIndicatorValueResponse,
  CalculateAllAvailableGrowthIndicatorValueUseCase,
  CalculateGrowthIndicatorValueRequest,
  CalculateGrowthIndicatorValueResponse,
  CalculateGrowthIndicatorValueUseCase,
  ClinicalAnalysisService,
  ClinicalNutritionalAnalysisAppService,
  ClinicalSignReference,
  ClinicalSignReferenceDto,
  ClinicalSignReferenceMapper,
  ClinicalSignReferenceRepository,
  ClinicalSignReferenceService,
  ClinicalValidationService,
  ClinicalVariableGeneratorService,
  CorrectDiagnosticResultRequest,
  CorrectDiagnosticResultResponse,
  CorrectDiagnosticResultUseCase,
  CreateAnthropometricMeasureRequest,
  CreateAnthropometricMeasureResponse,
  CreateAnthropometricMeasureUseCase,
  CreateBiochemicalReferenceRequest,
  CreateBiochemicalReferenceResponse,
  CreateBiochemicalReferenceUseCase,
  CreateClinicalSignReferenceRequest,
  CreateClinicalSignReferenceResponse,
  CreateClinicalSignReferenceUseCase,
  CreateDataFieldRefRequest,
  CreateDataFieldRefResponse,
  CreateDataFieldRefUseCase,
  CreateDiagnosticRuleRequest,
  CreateDiagnosticRuleResponse,
  CreateDiagnosticRuleUseCase,
  CreateGrowthReferenceChartRequest,
  CreateGrowthReferenceChartResponse,
  CreateGrowthReferenceChartUseCase,
  CreateGrowthReferenceTableRequest,
  CreateGrowthReferenceTableResponse,
  CreateGrowthReferenceTableUseCase,
  CreateIndicatorRequest,
  CreateIndicatorResponse,
  CreateIndicatorUseCase,
  CreateNutritionalAssessmentResultProps,
  CreateNutritionalDiagnosticProps,
  CreateNutritionalDiagnosticRequest,
  CreateNutritionalDiagnosticResponse,
  CreateNutritionalDiagnosticUseCase,
  CreateNutritionalRiskFactorRequest,
  CreateNutritionalRiskFactorResponse,
  CreateNutritionalRiskFactorUseCase,
  DataFieldReference,
  DataFieldReferenceDto,
  DataFieldReferenceMapper,
  DataFieldReferenceRepository,
  DataFieldReferenceService,
  DataFieldValidationService,
  DeleteAnthropometricMeasureRequest,
  DeleteAnthropometricMeasureResponse,
  DeleteAnthropometricMeasureUseCase,
  DeleteBiochemicalReferenceRequest,
  DeleteBiochemicalReferenceResponse,
  DeleteBiochemicalReferenceUseCase,
  DeleteClinicalSignReferenceRequest,
  DeleteClinicalSignReferenceResponse,
  DeleteClinicalSignReferenceUseCase,
  DeleteGrowthReferenceChartRequest,
  DeleteGrowthReferenceChartResponse,
  DeleteGrowthReferenceChartUseCase,
  DeleteGrowthReferenceTableRequest,
  DeleteGrowthReferenceTableResponse,
  DeleteGrowthReferenceTableUseCase,
  DeleteIndicatorRequest,
  DeleteIndicatorResponse,
  DeleteIndicatorUseCase,
  DeleteNutritionalDiagnosticRequest,
  DeleteNutritionalDiagnosticResponse,
  DeleteNutritionalDiagnosticUseCase,
  DeleteNutritionalRiskFactorRequest,
  DeleteNutritionalRiskFactorResponse,
  DeleteNutritionalRiskFactorUseCase,
  DiagnosticRule,
  DiagnosticRuleDto,
  DiagnosticRuleMapper,
  DiagnosticRuleRepository,
  DiagnosticRuleService,
  GenerateDiagnosticResultRequest,
  GenerateDiagnosticResultResponse,
  GenerateDiagnosticResultUseCase,
  GetAnthropometricMeasureRequest,
  GetAnthropometricMeasureResponse,
  GetAnthropometricMeasureUseCase,
  GetBiochemicalReferenceRequest,
  GetBiochemicalReferenceResponse,
  GetBiochemicalReferenceUseCase,
  GetClinicalSignReferenceRequest,
  GetClinicalSignReferenceResponse,
  GetClinicalSignReferenceUseCase,
  GetDataFieldRefRequest,
  GetDataFieldRefResponse,
  GetDataFieldRefUseCase,
  GetDiagnosticRuleRequest,
  GetDiagnosticRuleResponse,
  GetDiagnosticRuleUseCase,
  GetGrowthReferenceChartRequest,
  GetGrowthReferenceChartResponse,
  GetGrowthReferenceChartUseCase,
  GetGrowthReferenceTableRequest,
  GetGrowthReferenceTableResponse,
  GetGrowthReferenceTableUseCase,
  GetIndicatorRequest,
  GetIndicatorResponse,
  GetIndicatorUseCase,
  GetNutritionalDiagnosticRequest,
  GetNutritionalDiagnosticResponse,
  GetNutritionalDiagnosticUseCase,
  GetNutritionalRiskFactorRequest,
  GetNutritionalRiskFactorResponse,
  GetNutritionalRiskFactorUseCase,
  GrowthIndicatorService,
  GrowthIndicatorValueAppService,
  GrowthReferenceChart,
  GrowthReferenceChartDto,
  GrowthReferenceChartMapper,
  GrowthReferenceChartRepository,
  GrowthReferenceChartService,
  GrowthReferenceSelectionService,
  GrowthReferenceTable,
  GrowthReferenceTableDto,
  GrowthReferenceTableMapper,
  GrowthReferenceTableRepository,
  GrowthReferenceTableService,
  IAnthropometricMeasureService,
  IAnthropometricValidationService,
  IAnthropometricVariableGeneratorService,
  IBiochemicalReferenceService,
  IBiologicalAnalysisAppService,
  IBiologicalInterpretationService,
  IBiologicalValidationService,
  IBiologicalVariableGeneratorService,
  IClinicalAnalysisService,
  IClinicalNutritionalAnalysisAppService,
  IClinicalSignReferenceService,
  IClinicalValidationService,
  IClinicalVariableGeneratorService,
  IDataFieldReferenceService,
  IDiagnosticRuleService,
  IGrowthIndicatorService,
  IGrowthIndicatorValueAppService,
  IGrowthReferenceChartService,
  IGrowthReferenceTableService,
  IIndicatorService,
  IMakeClinicalSignDataInterpretationService,
  Indicator,
  IndicatorDto,
  IndicatorMapper,
  IndicatorRepository,
  IndicatorService,
  INormalizeAnthropometricDataAppService,
  INormalizeAnthropometricDataService,
  INutritionalAssessmentService,
  INutritionalDiagnosticService,
  INutritionalRiskFactorService,
  IPatientDataValidationService,
  IReferenceSelectionService,
  IValidatePatientMeasurementsService,
  IZScoreCalculationService,
  IZScoreInterpretationService,
  LenheiBasedStrategy,
  MakeBiologicalInterpretationRequest,
  MakeBiologicalInterpretationResponse,
  MakeBiologicalInterpretationUseCase,
  MakeClinicalAnalysisRequest,
  MakeClinicalAnalysisResponse,
  MakeClinicalAnalysisUseCase,
  MakeClinicalSignDataInterpretationRequest,
  MakeClinicalSignDataInterpretationResponse,
  MakeClinicalSignDataInterpretationService,
  MakeClinicalSignDataInterpretationUseCase,
  MakeIndependantDiagnosticRequest,
  MakeIndependantDiagnosticResponse,
  MakeIndependantDiagnosticUseCase,
  MedicalRecordACL,
  NormalizeAnthropometricDataAppService,
  NormalizeAnthropometricDataRequest,
  NormalizeAnthropometricDataResponse,
  NormalizeAnthropometricDataService,
  NormalizeAnthropometricDataUseCase,
  NutritionalAssessmentResult,
  NutritionalAssessmentResultDto,
  NutritionalAssessmentResultFactory,
  NutritionalAssessmentResultMapper,
  NutritionalAssessmentResultRepository,
  NutritionalDiagnostic,
  NutritionalDiagnosticDto,
  NutritionalDiagnosticFactory,
  NutritionalDiagnosticMapper,
  NutritionalDiagnosticRepository,
  NutritionalDiagnosticService,
  NutritionalRiskFactor,
  NutritionalRiskFactorDto,
  NutritionalRiskFactorMapper,
  NutritionalRiskFactorRepository,
  NutritionalRiskFactorService,
  PatientACL,
  PatientDiagnosticData,
  PatientDiagnosticDataDto,
  PatientDiagnosticDataMapper,
  PatientDiagnosticDataRepository,
  PerformPatientGlobalVariableRequest,
  PerformPatientGlobalVariableResponse,
  PerformPatientGlobalVariableUseCase,
  TableBasedStrategy,
  UnitAcl,
  UpdateAnthropometricMeasureRequest,
  UpdateAnthropometricMeasureResponse,
  UpdateAnthropometricMeasureUseCase,
  UpdateBiochemicalReferenceRequest,
  UpdateBiochemicalReferenceResponse,
  UpdateBiochemicalReferenceUseCase,
  UpdateClinicalSignReferenceRequest,
  UpdateClinicalSignReferenceResponse,
  UpdateClinicalSignReferenceUseCase,
  UpdateGrowthReferenceChartRequest,
  UpdateGrowthReferenceChartResponse,
  UpdateGrowthReferenceChartUseCase,
  UpdateGrowthReferenceTableRequest,
  UpdateGrowthReferenceTableResponse,
  UpdateGrowthReferenceTableUseCase,
  UpdateIndicatorRequest,
  UpdateIndicatorResponse,
  UpdateIndicatorUseCase,
  UpdateNutritionalRiskFactorRequest,
  UpdateNutritionalRiskFactorResponse,
  UpdateNutritionalRiskFactorUseCase,
  UpdatePatientDiagnosticDataRequest,
  UpdatePatientDiagnosticDataResponse,
  UpdatePatientDiagnosticDataUseCase,
  ValidateDataFieldResponseRequest,
  ValidateDataFieldResponseResponse,
  ValidateDataFieldResponseUseCase,
  ValidateMeasurementsRequest,
  ValidateMeasurementsResponse,
  ValidateMeasurementsUseCase,
  ValidatePatientMeasurementsService,
  ZScoreCalculationService,
  ZScoreInterpretationService,
} from "@/core/evaluation";
import {
  AnthropometricMeasurePersistenceDto,
  BiochemicalReferencePersistenceDto,
  ClinicalSignReferencePersistenceDto,
  DiagnosticRulePersistenceDto,
  GrowthReferenceChartPersistenceDto,
  GrowthReferenceTablePersistenceDto,
  IndicatorPersistenceDto,
  NutritionalAssessmentResultPersistenceDto,
  NutritionalDiagnosticPersistenceDto,
  NutritionalRiskFactorPersistenceDto,
  PatientDiagnosticDataPersistenceDto,
} from "./infra/dtos";
import {
  AnthropometricMeasureInfraMapper,
  BiochemicalReferenceInfraMapper,
  ClinicalSignReferenceInfraMapper,
  DataFieldReferenceInfraMapper,
  DiagnosticRuleInfraMapper,
  GrowthReferenceChartInfraMapper,
  GrowthReferenceTableInfraMapper,
  IndicatorInfraMapper,
  NutritionalAssessmentResultInfraMapper,
  NutritionalDiagnosticInfraMapper,
  NutritionalRiskFactorInfraMapper,
  PatientDiagnosticDataInfraMapper,
} from "./infra/mappers";
import {
  NutritionalAssessmentService,
  PatientDataValidationService,
} from "@/core/evaluation/domain/core/services";
import {
  NutritionalDiagnosticRepositoryWebImpl,
  AnthropometricMeasureRepositoryWebImpl,
  IndicatorRepositoryWebImpl,
  GrowthReferenceChartRepositoryWebImpl,
  ClinicalSignReferenceRepositoryWebImpl,
  BiochemicalReferenceRepositoryWebImpl,
  DiagnosticRuleRepositoryWebImpl,
  GrowthReferenceTableRepositoryWebImpl,
  NutritionalRiskFactorRepoWebImpl,
  DataFieldReferenceRepositoryWebImpl,
} from "./infra/repository.web";
import { MedicalRecordACLImpl, PatientACLImpl, UnitACLImpl } from "@core/sharedAcl";
import { UnitContext } from "../units/context";

import { PatientContext } from "../patient/context";
import {
  AfterAnthropometricDataAddedDiagnosticHandler,
  AfterBiologicalValueAddedDiagnosticHandler,
  AfterClinicalSignDataAddedDiagnosticHandler,
  AfterPatientCareSessionCreatedHandler,
} from "@/core/evaluation/application/subscribers";
import { GenerateUUID, IndexedDBConnection, isWebEnv } from "../shared";
import { SQLiteDatabase } from "expo-sqlite";
import {
  anthropometric_measures,
  AnthropometricMeasureRepositoryExpoImpl,
  biochemical_references,
  BiochemicalReferenceRepositoryExpoImpl,
  clinical_sign_references,
  ClinicalSignReferenceRepositoryExpoImpl,
  data_field_references,
  DataFieldReferencePersistenceDto,
  DataFieldRepositoryExpoImpl,
  diagnostic_rules,
  DiagnosticRuleRepositoryExpoImpl,
  growth_reference_charts,
  growth_reference_tables,
  GrowthReferenceChartRepositoryExpoImpl,
  GrowthReferenceTableRepositoryExpoImpl,
  IndicatorRepositoryExpoImpl,
  indicators,
  nutritional_assessment_results,
  nutritional_diagnostics,
  nutritional_risk_factors,
  NutritionalAssessmentResultRepositoryExpoImpl,
  NutritionalDiagnosticRepositoryExpoImpl,
  NutritionalRiskFactorRepositoryExpoImpl,
  patient_diagnostic_data,
  PatientDiagnosticDataRepositoryExpoImpl,
} from "./infra";
import { MedicalRecordContext } from "../medical_record";

export class DiagnosticContext {
  private static instance: DiagnosticContext | null = null;
  private readonly dbConnection: IndexedDBConnection | null;
  private readonly expo: SQLiteDatabase | null;
  private readonly idGenerator: GenerateUniqueId;
  private readonly eventBus: IEventBus;

  // Mappers Infra
  private readonly nutritionalDiagnosticInfraMapper: InfrastructureMapper<
    NutritionalDiagnostic,
    NutritionalDiagnosticPersistenceDto
  >;
  private readonly patientDiagnosticDataInfraMapper: InfrastructureMapper<
    PatientDiagnosticData,
    PatientDiagnosticDataPersistenceDto
  >;
  private readonly nutritionalAssessmentResultInfraMapper: InfrastructureMapper<
    NutritionalAssessmentResult,
    NutritionalAssessmentResultPersistenceDto
  >;
  private readonly anthroMeasureInfraMapper: InfrastructureMapper<
    AnthropometricMeasure,
    AnthropometricMeasurePersistenceDto
  >;
  private readonly indicatorInfraMapper: InfrastructureMapper<
    Indicator,
    IndicatorPersistenceDto
  >;
  private readonly growthRefTableInfraMapper: InfrastructureMapper<
    GrowthReferenceTable,
    GrowthReferenceTablePersistenceDto
  >;
  private readonly growthRefChartInfraMapper: InfrastructureMapper<
    GrowthReferenceChart,
    GrowthReferenceChartPersistenceDto
  >;
  private readonly clinicalRefInfraMapper: InfrastructureMapper<
    ClinicalSignReference,
    ClinicalSignReferencePersistenceDto
  >;
  private readonly biochemicalRefInfraMapper: InfrastructureMapper<
    BiochemicalReference,
    BiochemicalReferencePersistenceDto
  >;
  private readonly dataFieldRefInfraMapper: InfrastructureMapper<DataFieldReference, DataFieldReferencePersistenceDto>
  private readonly diagnosticRuleInfraMapper: InfrastructureMapper<
    DiagnosticRule,
    DiagnosticRulePersistenceDto
  >;
  private readonly nutritionalRiskFactorInfraMapper: InfrastructureMapper<
    NutritionalRiskFactor,
    NutritionalRiskFactorPersistenceDto
  >;


  // Repo
  // private readonly patientDiagnosticDataRepo: PatientDiagnosticDataRepository
  // private readonly nutritionalAssessmentRepo: NutritionalAssessmentResultRepository
  private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository;
  private readonly anthroMeasureRepo: AnthropometricMeasureRepository;
  private readonly indicatorRepo: IndicatorRepository;
  private readonly growthRefTableRepo: GrowthReferenceTableRepository;
  private readonly growthRefChartRepo: GrowthReferenceChartRepository;
  private readonly clinicalRefRepo: ClinicalSignReferenceRepository;
  private readonly biochemicalRefRepo: BiochemicalReferenceRepository;
  private readonly dataFieldRefRepo: DataFieldReferenceRepository;
  private readonly diagnosticRuleRepo: DiagnosticRuleRepository;
  private readonly nutritionalRiskFactorRepo: NutritionalRiskFactorRepository;

  // Domain Services
  private readonly anthroVariableGenerator: IAnthropometricVariableGeneratorService;
  private readonly anthroValidationService: IAnthropometricValidationService;
  private readonly growthIndicatorService: IGrowthIndicatorService;
  private readonly growthRefSelectionService: IReferenceSelectionService;
  private readonly normalizeAnthropometricDataService: INormalizeAnthropometricDataService;
  private readonly biologicalInterpretationService: IBiologicalInterpretationService;
  private readonly biologicalValidationService: IBiologicalValidationService;
  private readonly biologicalVariableGeneratorService: IBiologicalVariableGeneratorService;
  private readonly clinicalAnalysisService: IClinicalAnalysisService;
  private readonly clinicalValidationService: IClinicalValidationService;
  private readonly clinicalVariableGeneratorService: IClinicalVariableGeneratorService;
  private readonly dataFieldValidationService: DataFieldValidationService
  private readonly nutritionalAssessmentService: INutritionalAssessmentService;
  private readonly patientDataValidationService: IPatientDataValidationService;

  // Domain Services Associates
  private readonly zScoreCalculationService: IZScoreCalculationService;
  private readonly zScoreInterpretationService: IZScoreInterpretationService;

  // Domain Factory
  private readonly nutritionalAssessmentFactory: Factory<
    CreateNutritionalAssessmentResultProps,
    NutritionalAssessmentResult
  >;
  private readonly nutritionalDiagnosticFactory: Factory<
    CreateNutritionalDiagnosticProps,
    NutritionalDiagnostic
  >;

  // Application Mapper
  private readonly anthroMeasureAppMapper: ApplicationMapper<
    AnthropometricMeasure,
    AnthropometricMeasureDto
  >;
  private readonly indicatorAppMapper: ApplicationMapper<
    Indicator,
    IndicatorDto
  >;
  private readonly growthRefChartAppMapper: ApplicationMapper<
    GrowthReferenceChart,
    GrowthReferenceChartDto
  >;
  private readonly growthRefTableAppMapper: ApplicationMapper<
    GrowthReferenceTable,
    GrowthReferenceTableDto
  >;
  private readonly clinicalRefAppMapper: ApplicationMapper<
    ClinicalSignReference,
    ClinicalSignReferenceDto
  >;
  private readonly nutritionalRiskFactorAppMapper: ApplicationMapper<
    NutritionalRiskFactor,
    NutritionalRiskFactorDto
  >;
  private readonly biochemicalRefAppMapper: ApplicationMapper<
    BiochemicalReference,
    BiochemicalReferenceDto
  >;
  private readonly dataFieldRefAppMapper: ApplicationMapper<DataFieldReference, DataFieldReferenceDto>
  private readonly diagnosticRuleAppMapper: ApplicationMapper<
    DiagnosticRule,
    DiagnosticRuleDto
  >;
  private readonly nutritionalDiagnosticAppMapper: ApplicationMapper<
    NutritionalDiagnostic,
    NutritionalDiagnosticDto
  >;
  private readonly patientDiagnosticDataAppMapper: ApplicationMapper<
    PatientDiagnosticData,
    PatientDiagnosticDataDto
  >;
  private readonly nutritionalAssessmentAppMapper: ApplicationMapper<
    NutritionalAssessmentResult,
    NutritionalAssessmentResultDto
  >;

  // UseCases
  private readonly createMeasureUC: UseCase<
    CreateAnthropometricMeasureRequest,
    CreateAnthropometricMeasureResponse
  >;
  private readonly getMeasureUC: UseCase<
    GetAnthropometricMeasureRequest,
    GetAnthropometricMeasureResponse
  >;
  private readonly updateMeasureUC: UseCase<
    UpdateAnthropometricMeasureRequest,
    UpdateAnthropometricMeasureResponse
  >;
  private readonly deleteMeasureUC: UseCase<
    DeleteAnthropometricMeasureRequest,
    DeleteAnthropometricMeasureResponse
  >;
  private readonly createIndicatorUC: UseCase<
    CreateIndicatorRequest,
    CreateIndicatorResponse
  >;
  private readonly getIndicatorUC: UseCase<
    GetIndicatorRequest,
    GetIndicatorResponse
  >;
  private readonly updateIndicatorUC: UseCase<
    UpdateIndicatorRequest,
    UpdateIndicatorResponse
  >;
  private readonly deleteIndicatorUC: UseCase<
    DeleteIndicatorRequest,
    DeleteIndicatorResponse
  >;
  private readonly createGrowthRefChartUC: UseCase<
    CreateGrowthReferenceChartRequest,
    CreateGrowthReferenceChartResponse
  >;
  private readonly getGrowthRefChartUC: UseCase<
    GetGrowthReferenceChartRequest,
    GetGrowthReferenceChartResponse
  >;
  private readonly updateGrowthRefChartUC: UseCase<
    UpdateGrowthReferenceChartRequest,
    UpdateGrowthReferenceChartResponse
  >;
  private readonly deleteGrowthRefChartUC: UseCase<
    DeleteGrowthReferenceChartRequest,
    DeleteGrowthReferenceChartResponse
  >;
  private readonly createGrowthRefTableUC: UseCase<
    CreateGrowthReferenceTableRequest,
    CreateGrowthReferenceTableResponse
  >;
  private readonly getGrowthRefTableUC: UseCase<
    GetGrowthReferenceTableRequest,
    GetGrowthReferenceTableResponse
  >;
  private readonly updateGrowthRefTableUC: UseCase<
    UpdateGrowthReferenceTableRequest,
    UpdateGrowthReferenceTableResponse
  >;
  private readonly deleteGrowthRefTableUC: UseCase<
    DeleteGrowthReferenceTableRequest,
    DeleteGrowthReferenceTableResponse
  >;
  private readonly calculateGrowthIndicatorValueUC: UseCase<
    CalculateGrowthIndicatorValueRequest,
    CalculateGrowthIndicatorValueResponse
  >;
  private readonly calculateAllAvailableGrowthIndicatorValueUC: UseCase<
    CalculateAllAvailableGrowthIndicatorValueRequest,
    CalculateAllAvailableGrowthIndicatorValueResponse
  >;
  private readonly normalizeAnthropometricDataUC: UseCase<
    NormalizeAnthropometricDataRequest,
    NormalizeAnthropometricDataResponse
  >;
  private readonly createClinicalRefUC: UseCase<
    CreateClinicalSignReferenceRequest,
    CreateClinicalSignReferenceResponse
  >;
  private readonly getClinicalRefUC: UseCase<
    GetClinicalSignReferenceRequest,
    GetClinicalSignReferenceResponse
  >;
  private readonly updateClinicalRefUC: UseCase<
    UpdateClinicalSignReferenceRequest,
    UpdateClinicalSignReferenceResponse
  >;
  private readonly deleteClinicalRefUC: UseCase<
    DeleteClinicalSignReferenceRequest,
    DeleteClinicalSignReferenceResponse
  >;
  private readonly makeClinicalAnalysisUC: UseCase<
    MakeClinicalAnalysisRequest,
    MakeClinicalAnalysisResponse
  >;
  private readonly createNutritionalRiskFactorUC: UseCase<
    CreateNutritionalRiskFactorRequest,
    CreateNutritionalRiskFactorResponse
  >;
  private readonly getNutritionalRiskFactorUC: UseCase<
    GetNutritionalRiskFactorRequest,
    GetNutritionalRiskFactorResponse
  >;
  private readonly updateNutritionalRiskFactorUC: UseCase<
    UpdateNutritionalRiskFactorRequest,
    UpdateNutritionalRiskFactorResponse
  >;
  private readonly deleteNutritionalRiskFactorUC: UseCase<
    DeleteNutritionalRiskFactorRequest,
    DeleteNutritionalRiskFactorResponse
  >;

  private readonly createBiochemicalRefUC: UseCase<
    CreateBiochemicalReferenceRequest,
    CreateBiochemicalReferenceResponse
  >;
  private readonly getBiochemicalRefUC: UseCase<
    GetBiochemicalReferenceRequest,
    GetBiochemicalReferenceResponse
  >;
  private readonly updateBiochemicalRefUC: UseCase<
    UpdateBiochemicalReferenceRequest,
    UpdateBiochemicalReferenceResponse
  >;
  private readonly deleteBiochemicalRefUC: UseCase<
    DeleteBiochemicalReferenceRequest,
    DeleteBiochemicalReferenceResponse
  >;
  private readonly makeBiologicalInterpretationUC: UseCase<
    MakeBiologicalInterpretationRequest,
    MakeBiologicalInterpretationResponse
  >;
  private readonly createDataFieldReferenceUC: UseCase<CreateDataFieldRefRequest, CreateDataFieldRefResponse>
  private readonly getDataFieldReferenceUC: UseCase<GetDataFieldRefRequest, GetDataFieldRefResponse>
  private readonly valideDataFieldResponseUC: UseCase<ValidateDataFieldResponseRequest, ValidateDataFieldResponseResponse>
  private readonly createDiagnosticRuleUC: UseCase<
    CreateDiagnosticRuleRequest,
    CreateDiagnosticRuleResponse
  >;
  private readonly getDiagnosticRuleUC: UseCase<
    GetDiagnosticRuleRequest,
    GetDiagnosticRuleResponse
  >;

  // Core Diagnostic Use Cases
  private readonly createNutritionalDiagnosticUC: UseCase<
    CreateNutritionalDiagnosticRequest,
    CreateNutritionalDiagnosticResponse
  >;
  private readonly getNutritionalDiagnosticUC: UseCase<
    GetNutritionalDiagnosticRequest,
    GetNutritionalDiagnosticResponse
  >;
  private readonly deleteNutritionalDiagnosticUC: UseCase<
    DeleteNutritionalDiagnosticRequest,
    DeleteNutritionalDiagnosticResponse
  >;
  private readonly addNotesUC: UseCase<
    AddNoteToNutritionalDiagnosticRequest,
    AddNoteToNutritionalDiagnosticResponse
  >;
  private readonly correctDiagnosticUC: UseCase<
    CorrectDiagnosticResultRequest,
    CorrectDiagnosticResultResponse
  >;
  private readonly generateDiagnosticResultUC: UseCase<
    GenerateDiagnosticResultRequest,
    GenerateDiagnosticResultResponse
  >;
  private readonly updatePatientDiagnosticDataUC: UseCase<
    UpdatePatientDiagnosticDataRequest,
    UpdatePatientDiagnosticDataResponse
  >;
  private readonly makeIndependanteDiagnosticUC: UseCase<
    MakeIndependantDiagnosticRequest,
    MakeIndependantDiagnosticResponse
  >;
  private readonly performGlobalVariableUC: UseCase<
    PerformPatientGlobalVariableRequest,
    PerformPatientGlobalVariableResponse
  >;
  private readonly validateMeasurementDataUC: UseCase<
    ValidateMeasurementsRequest,
    ValidateMeasurementsResponse
  >;
  private readonly makeClinicalSignInterpretationUC: UseCase<
    MakeClinicalSignDataInterpretationRequest,
    MakeClinicalSignDataInterpretationResponse
  >;
  // Subscribers
  private readonly afterPatientCareSessionCreated: AfterPatientCareSessionCreatedHandler;
  private readonly afterAnthropometricDataAdded: AfterAnthropometricDataAddedDiagnosticHandler;
  private readonly afterClinicalSignAdded: AfterClinicalSignDataAddedDiagnosticHandler;
  private readonly afterBiologicalValueAdded: AfterBiologicalValueAddedDiagnosticHandler;
  // Application Services
  private readonly anthroMeasureAppService: IAnthropometricMeasureService;
  private readonly indicatorAppService: IIndicatorService;
  private readonly growthChartAppService: IGrowthReferenceChartService;
  private readonly growthTableAppService: IGrowthReferenceTableService;
  private readonly normalizeAnthropometricDataAppService: INormalizeAnthropometricDataAppService;
  private readonly clinicalRefAppService: IClinicalSignReferenceService;
  private readonly clinicalNutritionalAnalysisAppService: IClinicalNutritionalAnalysisAppService;
  private readonly diagnosticRuleAppService: IDiagnosticRuleService;
  private readonly nutritionalRiskFactorAppService: INutritionalRiskFactorService;
  private readonly biochemicalRefAppService: IBiochemicalReferenceService;
  private readonly biologicalAnalysisAppService: IBiologicalAnalysisAppService;
  private readonly nutritionalDiagnosticAppService: INutritionalDiagnosticService;
  private readonly validatePatientMeasurementsAppService: IValidatePatientMeasurementsService;
  private readonly growthIndicatorValueAppService: IGrowthIndicatorValueAppService;
  private readonly makeClinicalSignInterpretationAppService: IMakeClinicalSignDataInterpretationService;
  private readonly dataFieldReferenceAppService: IDataFieldReferenceService
  // ACL

  private readonly unitAcl: UnitAcl;
  private readonly patientAcl: PatientACL;
  private readonly medicalRecordAcl: MedicalRecordACL
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

    this.unitAcl = new UnitACLImpl(
      UnitContext.init(dbConnection, expo, this.eventBus).getService()
    );
    this.patientAcl = new PatientACLImpl(
      PatientContext.init(dbConnection, expo, this.eventBus).getService()
    );

    this.medicalRecordAcl = new MedicalRecordACLImpl(MedicalRecordContext.init(dbConnection, expo, this.eventBus).getMedicalRecordService())

    // Initialiser les mappers d'infrastructure
    this.patientDiagnosticDataInfraMapper =
      new PatientDiagnosticDataInfraMapper();
    this.nutritionalAssessmentResultInfraMapper =
      new NutritionalAssessmentResultInfraMapper();
    this.nutritionalDiagnosticInfraMapper =
      new NutritionalDiagnosticInfraMapper(
        this.patientDiagnosticDataInfraMapper,
        this.nutritionalAssessmentResultInfraMapper
      );
    this.anthroMeasureInfraMapper = new AnthropometricMeasureInfraMapper();
    this.indicatorInfraMapper = new IndicatorInfraMapper();
    this.growthRefTableInfraMapper = new GrowthReferenceTableInfraMapper();
    this.growthRefChartInfraMapper = new GrowthReferenceChartInfraMapper();
    this.clinicalRefInfraMapper = new ClinicalSignReferenceInfraMapper();
    this.biochemicalRefInfraMapper = new BiochemicalReferenceInfraMapper();
    this.dataFieldRefInfraMapper = new DataFieldReferenceInfraMapper()
    this.diagnosticRuleInfraMapper = new DiagnosticRuleInfraMapper();
    this.nutritionalRiskFactorInfraMapper =
      new NutritionalRiskFactorInfraMapper();

    // Initialiser les repositories
    this.nutritionalDiagnosticRepo = isWebEnv()
      ? new NutritionalDiagnosticRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.nutritionalDiagnosticInfraMapper,
        this.eventBus
      )
      : new NutritionalDiagnosticRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nutritionalDiagnosticInfraMapper,
        nutritional_diagnostics,
        this.eventBus,
        {
          diagnosticData: new PatientDiagnosticDataRepositoryExpoImpl(
            this.expo as SQLiteDatabase,
            this.patientDiagnosticDataInfraMapper,
            patient_diagnostic_data,
            this.eventBus
          ),
          result: new NutritionalAssessmentResultRepositoryExpoImpl(
            this.expo as SQLiteDatabase,
            this.nutritionalAssessmentResultInfraMapper,
            nutritional_assessment_results,
            this.eventBus
          ),
        },
        {
          diagnosticData: this.patientDiagnosticDataInfraMapper,
          result: this.nutritionalAssessmentResultInfraMapper,
        }
      );

    this.anthroMeasureRepo = isWebEnv()
      ? new AnthropometricMeasureRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.anthroMeasureInfraMapper
      )
      : new AnthropometricMeasureRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.anthroMeasureInfraMapper,
        anthropometric_measures,
        this.eventBus
      );
    this.indicatorRepo = isWebEnv()
      ? new IndicatorRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.indicatorInfraMapper
      )
      : new IndicatorRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.indicatorInfraMapper,
        indicators,
        this.eventBus
      );
    this.growthRefTableRepo = isWebEnv()
      ? new GrowthReferenceTableRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.growthRefTableInfraMapper
      )
      : new GrowthReferenceTableRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.growthRefTableInfraMapper,
        growth_reference_tables,
        this.eventBus
      );
    this.growthRefChartRepo = isWebEnv()
      ? new GrowthReferenceChartRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.growthRefChartInfraMapper
      )
      : new GrowthReferenceChartRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.growthRefChartInfraMapper,
        growth_reference_charts,
        this.eventBus
      );
    this.clinicalRefRepo = isWebEnv()
      ? new ClinicalSignReferenceRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.clinicalRefInfraMapper
      )
      : new ClinicalSignReferenceRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.clinicalRefInfraMapper,
        clinical_sign_references,
        this.eventBus
      );
    this.biochemicalRefRepo = isWebEnv()
      ? new BiochemicalReferenceRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.biochemicalRefInfraMapper
      )
      : new BiochemicalReferenceRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.biochemicalRefInfraMapper,
        biochemical_references,
        this.eventBus
      );
    this.dataFieldRefRepo = isWebEnv() ? new DataFieldReferenceRepositoryWebImpl(this.dbConnection as IndexedDBConnection,
      this.dataFieldRefInfraMapper
    ) : new DataFieldRepositoryExpoImpl(this.expo as SQLiteDatabase,
      this.dataFieldRefInfraMapper,
      data_field_references,
      this.eventBus
    )
    this.diagnosticRuleRepo = isWebEnv()
      ? new DiagnosticRuleRepositoryWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.diagnosticRuleInfraMapper
      )
      : new DiagnosticRuleRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.diagnosticRuleInfraMapper,
        diagnostic_rules,
        this.eventBus
      );
    this.nutritionalRiskFactorRepo = isWebEnv()
      ? new NutritionalRiskFactorRepoWebImpl(
        this.dbConnection as IndexedDBConnection,
        this.nutritionalRiskFactorInfraMapper
      )
      : new NutritionalRiskFactorRepositoryExpoImpl(
        this.expo as SQLiteDatabase,
        this.nutritionalRiskFactorInfraMapper,
        nutritional_risk_factors,
        this.eventBus
      );

    // Initialiser les services de domaine
    const anthroComputingHelper = new AnthroComputingHelper();
    const zScoreStrategies = [
      new AgeBasedStrategy(anthroComputingHelper),
      new LenheiBasedStrategy(anthroComputingHelper),
      new TableBasedStrategy(),
    ];
    this.zScoreCalculationService = new ZScoreCalculationService(
      zScoreStrategies
    );
    this.zScoreInterpretationService = new ZScoreInterpretationService();
    this.anthroVariableGenerator = new AnthropometricVariableGeneratorService(
      this.anthroMeasureRepo,
      this.unitAcl
    );
    this.anthroValidationService = new AnthropometricValidationService(
      this.anthroMeasureRepo,
      this.unitAcl
    );
    this.growthRefSelectionService = new GrowthReferenceSelectionService(
      this.growthRefChartRepo,
      this.growthRefTableRepo
    );
    this.growthIndicatorService = new GrowthIndicatorService(
      this.anthroMeasureRepo,
      this.indicatorRepo,
      this.growthRefSelectionService,
      this.zScoreCalculationService,
      this.zScoreInterpretationService
    );
    this.normalizeAnthropometricDataService =
      new NormalizeAnthropometricDataService(
        this.anthroMeasureRepo,
        this.unitAcl
      );
    this.biologicalInterpretationService = new BiologicalInterpretationService(
      this.biochemicalRefRepo,
      this.unitAcl
    );
    this.biologicalValidationService = new BiologicalValidationService(
      this.biochemicalRefRepo
    );
    this.biologicalVariableGeneratorService =
      new BiologicalVariableGeneratorService(this.biochemicalRefRepo);
    this.clinicalAnalysisService = new ClinicalAnalysisService(
      this.clinicalRefRepo,
      this.nutritionalRiskFactorRepo,
      this.unitAcl
    );
    this.clinicalValidationService = new ClinicalValidationService(
      this.clinicalRefRepo
    );
    this.clinicalVariableGeneratorService =
      new ClinicalVariableGeneratorService(this.clinicalRefRepo);
    this.patientDataValidationService = new PatientDataValidationService(
      this.anthroValidationService,
      this.clinicalValidationService,
      this.biologicalValidationService
    );
    this.dataFieldValidationService = new DataFieldValidationService(this.dataFieldRefRepo)
    // Factories Needs
    this.nutritionalAssessmentFactory = new NutritionalAssessmentResultFactory(
      this.idGenerator
    );
    // Services
    this.nutritionalAssessmentService = new NutritionalAssessmentService(
      this.anthroVariableGenerator,
      this.growthIndicatorService,
      this.clinicalAnalysisService,
      this.clinicalVariableGeneratorService,
      this.biologicalInterpretationService,
      this.biologicalVariableGeneratorService,
      this.diagnosticRuleRepo,
      this.nutritionalAssessmentFactory
    );
    this.patientDataValidationService = new PatientDataValidationService(
      this.anthroValidationService,
      this.clinicalValidationService,
      this.biologicalValidationService
    );

    // Initialiser les fabriques de domaine

    this.nutritionalDiagnosticFactory = new NutritionalDiagnosticFactory(
      this.idGenerator,
      this.patientDataValidationService
    );

    // Initialiser les mappers d'application
    this.anthroMeasureAppMapper = new AnthropometricMeasureMapper();
    this.indicatorAppMapper = new IndicatorMapper();
    this.growthRefChartAppMapper = new GrowthReferenceChartMapper();
    this.growthRefTableAppMapper = new GrowthReferenceTableMapper();
    this.clinicalRefAppMapper = new ClinicalSignReferenceMapper();
    this.biochemicalRefAppMapper = new BiochemicalReferenceMapper();
    this.dataFieldRefAppMapper = new DataFieldReferenceMapper()
    this.diagnosticRuleAppMapper = new DiagnosticRuleMapper();
    this.patientDiagnosticDataAppMapper = new PatientDiagnosticDataMapper();
    this.nutritionalAssessmentAppMapper =
      new NutritionalAssessmentResultMapper();
    this.nutritionalDiagnosticAppMapper = new NutritionalDiagnosticMapper(
      this.patientDiagnosticDataAppMapper,
      this.nutritionalAssessmentAppMapper
    );
    this.nutritionalRiskFactorAppMapper = new NutritionalRiskFactorMapper();

    // Initialiser les cas d'utilisation
    this.createMeasureUC = new CreateAnthropometricMeasureUseCase(
      this.idGenerator,
      this.anthroMeasureRepo
    );
    this.getMeasureUC = new GetAnthropometricMeasureUseCase(
      this.anthroMeasureRepo,
      this.anthroMeasureAppMapper
    );
    this.updateMeasureUC = new UpdateAnthropometricMeasureUseCase(
      this.anthroMeasureRepo,
      this.anthroMeasureAppMapper
    );
    this.deleteMeasureUC = new DeleteAnthropometricMeasureUseCase(
      this.anthroMeasureRepo,
      this.anthroMeasureAppMapper
    );

    this.createIndicatorUC = new CreateIndicatorUseCase(
      this.idGenerator,
      this.indicatorRepo
    );
    this.getIndicatorUC = new GetIndicatorUseCase(
      this.indicatorRepo,
      this.indicatorAppMapper
    );
    this.updateIndicatorUC = new UpdateIndicatorUseCase(
      this.indicatorRepo,
      this.indicatorAppMapper
    );
    this.deleteIndicatorUC = new DeleteIndicatorUseCase(
      this.indicatorRepo,
      this.indicatorAppMapper
    );

    this.createGrowthRefChartUC = new CreateGrowthReferenceChartUseCase(
      this.idGenerator,
      this.growthRefChartRepo
    );
    this.getGrowthRefChartUC = new GetGrowthReferenceChartUseCase(
      this.growthRefChartRepo,
      this.growthRefChartAppMapper
    );
    this.updateGrowthRefChartUC = new UpdateGrowthReferenceChartUseCase(
      this.growthRefChartRepo,
      this.growthRefChartAppMapper
    );
    this.deleteGrowthRefChartUC = new DeleteGrowthReferenceChartUseCase(
      this.growthRefChartRepo,
      this.growthRefChartAppMapper
    );

    // Growth Reference Table Use Cases
    this.createGrowthRefTableUC = new CreateGrowthReferenceTableUseCase(
      this.idGenerator,
      this.growthRefTableRepo
    );
    this.getGrowthRefTableUC = new GetGrowthReferenceTableUseCase(
      this.growthRefTableRepo,
      this.growthRefTableAppMapper
    );
    this.updateGrowthRefTableUC = new UpdateGrowthReferenceTableUseCase(
      this.growthRefTableRepo,
      this.growthRefTableAppMapper
    );
    this.deleteGrowthRefTableUC = new DeleteGrowthReferenceTableUseCase(
      this.growthRefTableAppMapper,
      this.growthRefTableRepo
    );
    // Growth Indicator value Use Cases

    this.calculateGrowthIndicatorValueUC =
      new CalculateGrowthIndicatorValueUseCase(
        this.anthroValidationService,
        this.anthroVariableGenerator,
        this.growthIndicatorService
      );
    this.calculateAllAvailableGrowthIndicatorValueUC =
      new CalculateAllAvailableGrowthIndicatorValueUseCase(
        this.anthroValidationService,
        this.anthroVariableGenerator,
        this.growthIndicatorService
      );

    this.normalizeAnthropometricDataUC = new NormalizeAnthropometricDataUseCase(
      this.normalizeAnthropometricDataService
    );
    // Clinical Reference Use Cases
    this.createClinicalRefUC = new CreateClinicalSignReferenceUseCase(
      this.idGenerator,
      this.clinicalRefRepo
    );
    this.getClinicalRefUC = new GetClinicalSignReferenceUseCase(
      this.clinicalRefRepo,
      this.clinicalRefAppMapper
    );
    this.updateClinicalRefUC = new UpdateClinicalSignReferenceUseCase(
      this.clinicalRefRepo,
      this.clinicalRefAppMapper
    );
    this.deleteClinicalRefUC = new DeleteClinicalSignReferenceUseCase(
      this.clinicalRefRepo,
      this.clinicalRefAppMapper
    );
    this.makeClinicalAnalysisUC = new MakeClinicalAnalysisUseCase(
      this.clinicalValidationService,
      this.clinicalAnalysisService
    );

    // Nutritional Risk Factor UseCases
    this.createNutritionalRiskFactorUC = new CreateNutritionalRiskFactorUseCase(
      this.idGenerator,
      this.nutritionalRiskFactorRepo,
      this.clinicalRefRepo
    );
    this.getNutritionalRiskFactorUC = new GetNutritionalRiskFactorUseCase(
      this.nutritionalRiskFactorRepo,
      this.nutritionalRiskFactorAppMapper
    );
    this.updateNutritionalRiskFactorUC = new UpdateNutritionalRiskFactorUseCase(
      this.nutritionalRiskFactorRepo,
      this.nutritionalRiskFactorAppMapper
    );
    this.deleteNutritionalRiskFactorUC = new DeleteNutritionalRiskFactorUseCase(
      this.nutritionalRiskFactorRepo,
      this.nutritionalRiskFactorAppMapper
    );

    // Biochemical Reference Use Cases
    this.createBiochemicalRefUC = new CreateBiochemicalReferenceUseCase(
      this.idGenerator,
      this.biochemicalRefRepo
    );
    this.getBiochemicalRefUC = new GetBiochemicalReferenceUseCase(
      this.biochemicalRefRepo,
      this.biochemicalRefAppMapper
    );
    this.updateBiochemicalRefUC = new UpdateBiochemicalReferenceUseCase(
      this.biochemicalRefRepo,
      this.biochemicalRefAppMapper
    );
    this.deleteBiochemicalRefUC = new DeleteBiochemicalReferenceUseCase(
      this.biochemicalRefRepo,
      this.biochemicalRefAppMapper
    );
    this.makeBiologicalInterpretationUC =
      new MakeBiologicalInterpretationUseCase(
        this.biologicalValidationService,
        this.biologicalInterpretationService
      );
    this.createDataFieldReferenceUC = new CreateDataFieldRefUseCase(this.idGenerator, this.dataFieldRefRepo)
    this.getDataFieldReferenceUC = new GetDataFieldRefUseCase(this.dataFieldRefRepo, this.dataFieldRefAppMapper)
    this.valideDataFieldResponseUC = new ValidateDataFieldResponseUseCase(this.dataFieldValidationService)
    // Core Diagnostic Use Cases
    // Core Diagnostic Rules

    this.createDiagnosticRuleUC = new CreateDiagnosticRuleUseCase(
      this.idGenerator,
      this.diagnosticRuleRepo
    );
    this.getDiagnosticRuleUC = new GetDiagnosticRuleUseCase(
      this.diagnosticRuleRepo,
      this.diagnosticRuleAppMapper
    );

    // Core Nutritional Diagnostic
    this.createNutritionalDiagnosticUC = new CreateNutritionalDiagnosticUseCase(
      this.nutritionalDiagnosticFactory,
      this.nutritionalDiagnosticRepo,
      this.patientAcl
    );
    this.getNutritionalDiagnosticUC = new GetNutritionalDiagnosticUseCase(
      this.nutritionalDiagnosticRepo,
      this.nutritionalDiagnosticAppMapper
    );
    this.deleteNutritionalDiagnosticUC = new DeleteNutritionalDiagnosticUseCase(
      this.nutritionalDiagnosticRepo,
      this.nutritionalDiagnosticAppMapper
    );
    this.generateDiagnosticResultUC = new GenerateDiagnosticResultUseCase(
      this.nutritionalDiagnosticRepo,
      this.nutritionalAssessmentService,
      this.medicalRecordAcl,
      this.patientAcl,
      this.nutritionalAssessmentAppMapper
    );
    this.addNotesUC = new AddNoteToNutritionalDiagnosticUseCase(
      this.nutritionalDiagnosticRepo
    );
    this.updatePatientDiagnosticDataUC = new UpdatePatientDiagnosticDataUseCase(
      this.nutritionalDiagnosticRepo,
      this.patientDataValidationService,
      this.patientDiagnosticDataAppMapper
    );
    this.correctDiagnosticUC = new CorrectDiagnosticResultUseCase(
      this.idGenerator,
      this.nutritionalDiagnosticRepo
    );
    this.makeIndependanteDiagnosticUC = new MakeIndependantDiagnosticUseCase(
      this.nutritionalAssessmentService,
      this.nutritionalAssessmentAppMapper
    );

    // System Internal UseCase
    this.performGlobalVariableUC = new PerformPatientGlobalVariableUseCase(
      this.nutritionalDiagnosticRepo,
      this.nutritionalAssessmentService,
      this.anthroVariableGenerator,
      this.clinicalVariableGeneratorService
    );
    this.validateMeasurementDataUC = new ValidateMeasurementsUseCase(
      this.nutritionalDiagnosticRepo,
      this.patientDataValidationService
    );
    this.makeClinicalSignInterpretationUC =
      new MakeClinicalSignDataInterpretationUseCase(
        this.nutritionalDiagnosticRepo,
        this.makeClinicalAnalysisUC
      );
    // Subscribers
    this.afterPatientCareSessionCreated =
      new AfterPatientCareSessionCreatedHandler(
        this.performGlobalVariableUC,
        this.eventBus
      );
    this.afterAnthropometricDataAdded =
      new AfterAnthropometricDataAddedDiagnosticHandler(
        this.updatePatientDiagnosticDataUC
      );
    this.afterClinicalSignAdded =
      new AfterClinicalSignDataAddedDiagnosticHandler(
        this.updatePatientDiagnosticDataUC
      );
    this.afterBiologicalValueAdded =
      new AfterBiologicalValueAddedDiagnosticHandler(
        this.updatePatientDiagnosticDataUC
      );

    this.eventBus.subscribe(this.afterPatientCareSessionCreated);
    this.eventBus.subscribe(this.afterAnthropometricDataAdded);
    this.eventBus.subscribe(this.afterBiologicalValueAdded);
    this.eventBus.subscribe(this.afterClinicalSignAdded);
    // Application Services
    this.anthroMeasureAppService = new AnthropometricMeasureService({
      createUC: this.createMeasureUC,
      getUC: this.getMeasureUC,
      updateUC: this.updateMeasureUC,
      deleteUC: this.deleteMeasureUC,
    });

    this.indicatorAppService = new IndicatorService({
      createUC: this.createIndicatorUC,
      getUC: this.getIndicatorUC,
      updateUC: this.updateIndicatorUC,
      deleteUC: this.deleteIndicatorUC,
    });

    this.growthChartAppService = new GrowthReferenceChartService({
      createUC: this.createGrowthRefChartUC,
      getUC: this.getGrowthRefChartUC,
      updateUC: this.updateGrowthRefChartUC,
      deleteUC: this.deleteGrowthRefChartUC,
    });

    this.growthTableAppService = new GrowthReferenceTableService({
      createUC: this.createGrowthRefTableUC,
      getUC: this.getGrowthRefTableUC,
      updateUC: this.updateGrowthRefTableUC,
      deleteUC: this.deleteGrowthRefTableUC,
    });
    this.growthIndicatorValueAppService = new GrowthIndicatorValueAppService({
      calculateIndicator: this.calculateGrowthIndicatorValueUC,
      calculateAllAvailableIndicator:
        this.calculateAllAvailableGrowthIndicatorValueUC,
    });
    this.normalizeAnthropometricDataAppService =
      new NormalizeAnthropometricDataAppService({
        normalizeUC: this.normalizeAnthropometricDataUC,
      });
    this.clinicalRefAppService = new ClinicalSignReferenceService({
      createUC: this.createClinicalRefUC,
      getUC: this.getClinicalRefUC,
      updateUC: this.updateClinicalRefUC,
      deleteUC: this.deleteClinicalRefUC,
    });
    this.clinicalNutritionalAnalysisAppService =
      new ClinicalNutritionalAnalysisAppService({
        makeClinicalAnalysis: this.makeClinicalAnalysisUC,
      });

    this.nutritionalRiskFactorAppService = new NutritionalRiskFactorService({
      createUC: this.createNutritionalRiskFactorUC,
      getUC: this.getNutritionalRiskFactorUC,
      updateUC: this.updateNutritionalRiskFactorUC,
      deleteUC: this.deleteNutritionalRiskFactorUC,
    });
    this.biochemicalRefAppService = new BiochemicalReferenceService({
      createUC: this.createBiochemicalRefUC,
      getUC: this.getBiochemicalRefUC,
      updateUC: this.updateBiochemicalRefUC,
      deleteUC: this.deleteBiochemicalRefUC,
    });
    this.biologicalAnalysisAppService = new BiologicalAnalysisAppService({
      makeInterpretation: this.makeBiologicalInterpretationUC,
    });
    this.dataFieldReferenceAppService = new DataFieldReferenceService({
      createUC: this.createDataFieldReferenceUC,
      getUC: this.getDataFieldReferenceUC,
      validationUC: this.valideDataFieldResponseUC
    })
    this.diagnosticRuleAppService = new DiagnosticRuleService({
      createUC: this.createDiagnosticRuleUC,
      getUC: this.getDiagnosticRuleUC,
    });

    this.nutritionalDiagnosticAppService = new NutritionalDiagnosticService({
      createUC: this.createNutritionalDiagnosticUC,
      getUC: this.getNutritionalDiagnosticUC,
      deleteUC: this.deleteNutritionalDiagnosticUC,
      addNotesUC: this.addNotesUC,
      generateDiagnosticResultUC: this.generateDiagnosticResultUC,
      updatePatientDiagnosticDataUC: this.updatePatientDiagnosticDataUC,
      correctDiagnosticResultUC: this.correctDiagnosticUC,
      makeIndependanteDiagnosticUC: this.makeIndependanteDiagnosticUC,
    });
    this.validatePatientMeasurementsAppService =
      new ValidatePatientMeasurementsService({
        validateUC: this.validateMeasurementDataUC,
      });
    this.makeClinicalSignInterpretationAppService =
      new MakeClinicalSignDataInterpretationService({
        interpretUC: this.makeClinicalSignInterpretationUC,
      });
  }

  static init(
    dbConnection: IndexedDBConnection | null,
    expo: SQLiteDatabase | null,
    eventBus: IEventBus
  ) {
    if (!this.instance) {
      this.instance = new DiagnosticContext(dbConnection, expo, eventBus);
    }
    return this.instance as DiagnosticContext;
  }
  // Méthodes d'accès aux services d'application
  getAnthropometricMeasureService(): IAnthropometricMeasureService {
    return this.anthroMeasureAppService;
  }

  getIndicatorService(): IIndicatorService {
    return this.indicatorAppService;
  }

  getGrowthReferenceChartService(): IGrowthReferenceChartService {
    return this.growthChartAppService;
  }

  getGrowthReferenceTableService(): IGrowthReferenceTableService {
    return this.growthTableAppService;
  }
  getGrowthIndicatorValueService(): IGrowthIndicatorValueAppService {
    return this.growthIndicatorValueAppService;
  }
  getClinicalSignReferenceService(): IClinicalSignReferenceService {
    return this.clinicalRefAppService;
  }
  getClinicalNutritionalAnalysisService(): IClinicalNutritionalAnalysisAppService {
    return this.clinicalNutritionalAnalysisAppService;
  }

  getNutritionalRiskFactorService(): INutritionalRiskFactorService {
    return this.nutritionalRiskFactorAppService;
  }

  getBiochemicalReferenceService(): IBiochemicalReferenceService {
    return this.biochemicalRefAppService;
  }
  getBiologicalAnalysisService(): IBiologicalAnalysisAppService {
    return this.biologicalAnalysisAppService;
  }
  getDiagnosticRuleService(): IDiagnosticRuleService {
    return this.diagnosticRuleAppService;
  }

  getNutritionalDiagnosticService(): INutritionalDiagnosticService {
    return this.nutritionalDiagnosticAppService;
  }

  getValidatePatientMeasurementsService(): IValidatePatientMeasurementsService {
    return this.validatePatientMeasurementsAppService;
  }
  getMakeClinicalSignDataInterpretationService(): IMakeClinicalSignDataInterpretationService {
    return this.makeClinicalSignInterpretationAppService;
  }
  getNormalizeAnthropomtricDataService(): INormalizeAnthropometricDataAppService {
    return this.normalizeAnthropometricDataAppService;
  }
  getDataFieldService(): IDataFieldReferenceService {
    return this.dataFieldReferenceAppService
  }
  // Méthode de nettoyage des ressources si nécessaire
  dispose(): void {
    this.eventBus.unsubscribe(this.afterPatientCareSessionCreated);
    this.eventBus.unsubscribe(this.afterAnthropometricDataAdded);
    this.eventBus.unsubscribe(this.afterClinicalSignAdded);
    this.eventBus.unsubscribe(this.afterBiologicalValueAdded);
    DiagnosticContext.instance = null;
  }
}
