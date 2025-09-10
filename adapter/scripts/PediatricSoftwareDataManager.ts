import {
  IAnthropometricMeasureService,
  IBiochemicalReferenceService,
  IClinicalSignReferenceService,
  IDataFieldReferenceService,
  IDiagnosticRuleService,
  IGrowthReferenceChartService,
  IGrowthReferenceTableService,
  IIndicatorService,
  INutritionalRiskFactorService,
  NextClinicalAppServices,
  TableDataDto,
  IAppetiteTestAppService as EvaluationIAppetiteTestAppService,
} from "@/core/evaluation";
import {
  AnthropometricMeasure,
  AppetiteTestRef,
  BiochemicalReference,
  ClinicalSignReference,
  ComplicationDto,
  CreateIndicatorProps,
  DataFieldReference,
  DiagnosticRule,
  GrowthReferenceChartProps,
  GrowthReferenceTableProps,
  Medicine,
  Milk,
  Next_ClinicalSignReference,
  NutritionalRiskFactor,
  OrientationRef,
  UnitProps,
  CarePhaseReference,
  Next_Medicine,
  NutitionalProduct,
  MilkEntity,
  Next_OrientationRef,
} from "./types";
import {
  IAppetiteTestAppService,
  IComplicationAppService,
  IMedicineAppService,
  IMilkAppService,
  IOrientationAppService,
  NextNutritionCareAppService,
  ICarePhaseReferenceAppService,
} from "@core/nutrition_care";
import { IUnitService } from "@core/units";
import { Message, Sex } from "@shared";
import { PediatricSoftwareDataZipFileArch } from "../constants/PediatricSofWareDataZipFileArch";
import { sleep } from "../shared";
export interface InitializationProgress {
  stage: string;
  completed: number;
  total: number;
  message: string;
}

export interface InitializationError {
  stage: string;
  error: string;
  entityId?: string;
}

export type InitializationObserver = {
  onProgress: (progress: InitializationProgress) => void;
  onError: (error: InitializationError) => void;
  onComplete: () => void;
};
export interface AppService {
  anthropometricService: IAnthropometricMeasureService;
  growthChartService: IGrowthReferenceChartService;
  growthTableService: IGrowthReferenceTableService;
  indicatorService: IIndicatorService;
  clinicalRefService: IClinicalSignReferenceService;
  nutritionalRiskService: INutritionalRiskFactorService;
  biochemicalRefService: IBiochemicalReferenceService;
  diagnosticRuleService: IDiagnosticRuleService;
  appetiteTestRefService: IAppetiteTestAppService;
  medicineService: IMedicineAppService;
  orientationService: IOrientationAppService;
  complicationService: IComplicationAppService;
  unitService: IUnitService;
  milkService: IMilkAppService;
  nextClinicalRefService: NextClinicalAppServices.IClinicalSignRefService;
  nextNutritionalRiskRefService: NextClinicalAppServices.INutritionalRiskFactorService;
  dataFieldService: IDataFieldReferenceService;
  evaluationAppetiteTest: EvaluationIAppetiteTestAppService;
  carePhaseReferenceService: ICarePhaseReferenceAppService;
  nextMedicineService: NextNutritionCareAppService.IMedicineAppService;
  nextNutritionalProductService: NextNutritionCareAppService.NutritionalProductService;
  nextMilkService: NextNutritionCareAppService.MilkService;
  nextOrientationService: NextNutritionCareAppService.OrientationService;
}

export interface PediatricSoftwareData {
  measures: AnthropometricMeasure[];
  indicators: CreateIndicatorProps[];
  clinicalSigns: ClinicalSignReference[];
  nutritionalRiskFactors: NutritionalRiskFactor[];
  biochemicalReferences: BiochemicalReference[];
  diagnosticRules: DiagnosticRule[];
  appetiteTestRefs: AppetiteTestRef[];
  orientationRefs: OrientationRef[];
  medicines: Medicine[];
  units: UnitProps[];
  milks: Milk[];
  complications: ComplicationDto[];
  growthReferenceCharts: GrowthReferenceChartProps[];
  growthReferenceTables: GrowthReferenceTableProps[];
  nextClinicalSigns: Next_ClinicalSignReference[];
  dataFields: DataFieldReference[];
  carePhases: CarePhaseReference[];
  nextMedicines: Next_Medicine[];
  nutritionalProducts: NutitionalProduct[];
  nextMilks: MilkEntity[];
  nextOrientations: Next_OrientationRef[];
  nextAppetiteTestRefs: AppetiteTestRef[];
}
export class PediatricSoftwareDataManager {
  private observers: InitializationObserver[] = [];
  private totalSteps = 22; // Nombre total d'étapes d'initialisation
  private currentStep = 0;

  constructor(private appService: AppService) { }

  addObserver(observer: InitializationObserver) {
    this.observers.push(observer);
  }

  removeObserver(observer: InitializationObserver) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  private notifyProgress(
    stage: string,
    completed: number,
    total: number,
    message: string
  ) {
    this.observers.forEach(observer => {
      observer.onProgress({
        stage,
        completed,
        total,
        message,
      });
    });
  }

  private notifyError(stage: string, error: string, entityId?: string) {
    this.observers.forEach(observer => {
      observer.onError({
        stage,
        error,
        entityId,
      });
    });
  }

  private notifyComplete() {
    this.observers.forEach(observer => {
      observer.onComplete();
    });
  }

  async initialize(data: PediatricSoftwareData) {
    this.currentStep = 0;

    try {
      await this.processStep("Anthropometric Measures", () =>
        this.addAnthropometricMeasure(data.measures)
      );
      await this.processStep("Growth Charts", () =>
        this.addGrowthChart(data.growthReferenceCharts)
      );
      await this.processStep("Growth Tables", () =>
        this.addGrowthTable(data.growthReferenceTables)
      );
      await this.processStep("Indicators", () =>
        this.addIndicator(data.indicators)
      );
      await this.processStep("Clinical Signs", () =>
        this.addClinicalSignReference(data.clinicalSigns)
      );
      await this.processStep("Biochemical References", () =>
        this.addBiochemicalReference(data.biochemicalReferences)
      );
      await this.processStep("Diagnostic Rules", () =>
        this.addDiagnosticRule(data.diagnosticRules)
      );
      await this.processStep("Appetite Tests", () =>
        this.addAppetiteTestRef(data.appetiteTestRefs)
      );
      await this.processStep("Orientation References", () =>
        this.addOrientationRef(data.orientationRefs)
      );
      await this.processStep("Complications", () =>
        this.addComplication(data.complications)
      );
      await this.processStep("Milks", () => this.addMilk(data.milks));
      await this.processStep("Medicines", () =>
        this.addMedicine(data.medicines)
      );
      await this.processStep("Units", () => this.addUnit(data.units));
      await this.processStep("Nutritional Risk Factors", () =>
        this.addNutritionalRiskFactor(data.nutritionalRiskFactors)
      );
      await this.processStep("Next Clinical Signs", () =>
        this.addNextClinicalRef(data.nextClinicalSigns)
      );
      await this.processStep("Data Fields", () =>
        this.addDataFields(data.dataFields)
      );
      await this.processStep("Care Phases", () =>
        this.addCarePhase(data.carePhases)
      );
      await this.processStep("Next Medicines", () =>
        this.addNextMedicine(data.nextMedicines)
      );
      await this.processStep("Next Nutritional Products", () =>
        this.addNextNutritionalProduct(data.nutritionalProducts)
      );
      await this.processStep("Next Milks", () =>
        this.addNextMilk(data.nextMilks)
      );
      await this.processStep("Next Orientations", () =>
        this.addNextOrientationRef(data.nextOrientations)
      );
      await this.processStep("Next Appetite Tests", () =>
        this.addNextAppetiteTestRef(data.nextAppetiteTestRefs)
      );

      this.notifyComplete();
    } catch (error) {
      this.notifyError(
        "Initialization",
        `Global initialization error: ${error}`
      );
      throw error;
    }
  }

  private async processStep(stageName: string, process: () => Promise<void>) {
    try {
      this.notifyProgress(
        stageName,
        this.currentStep,
        this.totalSteps,
        `Processing ${stageName}...`
      );
      await process();
      this.currentStep++;
      await sleep(1000);
      this.notifyProgress(
        stageName,
        this.currentStep,
        this.totalSteps,
        `${stageName} completed`
      );
    } catch (error) {
      this.notifyError(stageName, `Error processing ${stageName}: ${error}`);
      throw error;
    }
  }

  async addAnthropometricMeasure(measures: AnthropometricMeasure[]) {
    await Promise.all(
      measures.map(async measure => {
        try {
          const result = await this.appService.anthropometricService.create({
            data: measure,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Anthropometric Measure",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Anthropometric Measure", `${error}`);
          throw error;
        }
      })
    );
  }
  async addGrowthChart(growthCharts: GrowthReferenceChartProps[]) {
    await Promise.all(
      growthCharts.map(async chart => {
        try {
          const result = await this.appService.growthChartService.create({
            data: chart,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Growth Chart",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Growth Chart", `${error}`);
          throw error;
        }
      })
    );
  }

  async addGrowthTable(growthTables: GrowthReferenceTableProps[]) {
    await Promise.all(
      growthTables.map(async table => {
        try {
          const result = await this.appService.growthTableService.create({
            data: {
              ...table,
              data: table.data.map(
                (item): TableDataDto => ({
                  isUnisex: item.isUnisex,
                  median: item.median ?? 0,
                  normalNeg: item.normalNeg ?? 0,
                  outComeTargetValueNeg: item.outComeTargetValueNeg ?? 0,
                  moderateNeg: item.moderateNeg ?? 0,
                  severeNeg: item.severeNeg ?? 0,
                  hightSeverNeg: item.hightSeverNeg ?? 0,
                  sex: (item.sex ?? Sex.OTHER) as Sex,
                  value: item.value,
                })
              ),
            },
          });
          if (result instanceof Message) {
            this.notifyError(
              "Growth Table",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Growth Table", `${error}`);
          throw error;
        }
      })
    );
  }

  async addIndicator(indicators: CreateIndicatorProps[]) {
    await Promise.all(
      indicators.map(async indicator => {
        try {
          const result = await this.appService.indicatorService.create({
            data: indicator,
          });
          if (result instanceof Message) {
            this.notifyError("Indicator", `${result.type}: ${result.content}`);
          }
          return result;
        } catch (error) {
          this.notifyError("Indicator", `${error}`);
          throw error;
        }
      })
    );
  }

  async addClinicalSignReference(clinicalSigns: ClinicalSignReference[]) {
    await Promise.all(
      clinicalSigns.map(async sign => {
        try {
          const result = await this.appService.clinicalRefService.create({
            data: sign,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Clinical Sign Reference",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Clinical Sign Reference", `${error}`);
          throw error;
        }
      })
    );
  }

  async addNutritionalRiskFactor(
    nutritionalRiskFactors: NutritionalRiskFactor[]
  ) {
    await Promise.all(
      nutritionalRiskFactors.map(async factor => {
        try {
          const result = await this.appService.nutritionalRiskService.create({
            data: factor,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Nutritional Risk Factor",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Nutritional Risk Factor", `${error}`);
          throw error;
        }
      })
    );
  }

  async addBiochemicalReference(biochemicalReferences: BiochemicalReference[]) {
    await Promise.all(
      biochemicalReferences.map(async ref => {
        try {
          const result = await this.appService.biochemicalRefService.create({
            data: { ...ref, notes: ref.notes ?? [] },
          });
          if (result instanceof Message) {
            this.notifyError(
              "Biochemical Reference",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Biochemical Reference", `${error}`);
          throw error;
        }
      })
    );
  }

  async addDiagnosticRule(diagnosticRules: DiagnosticRule[]) {
    await Promise.all(
      diagnosticRules.map(async rule => {
        try {
          const result = await this.appService.diagnosticRuleService.create({
            data: rule,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Diagnostic Rule",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Diagnostic Rule", `${error}`);
          throw error;
        }
      })
    );
  }

  async addAppetiteTestRef(appetiteTestRefs: AppetiteTestRef[]) {
    await Promise.all(
      appetiteTestRefs.map(async ref => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await this.appService.appetiteTestRefService.create({
            data: ref as any,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Appetite Test Reference",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Appetite Test Reference", `${error}`);
          throw error;
        }
      })
    );
  }

  async addOrientationRef(orientationRefs: OrientationRef[]) {
    await Promise.all(
      orientationRefs.map(async ref => {
        try {
          const result = await this.appService.orientationService.create({
            data: ref,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Orientation Reference",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Orientation Reference", `${error}`);
          throw error;
        }
      })
    );
  }
  async addMedicine(medicines: Medicine[]) {
    await Promise.all(
      medicines.map(async medicine => {
        try {
          const result = await this.appService.medicineService.create({
            data: {
              ...medicine,
              notes: medicine.notes ?? [],
              warnings: medicine.warnings ?? [],
              interactions: medicine.interactions ?? [],
              contraindications: medicine.contraindications ?? [],
            },
          });
          if (result instanceof Message) {
            this.notifyError("Medicine", `${result.type}: ${result.content}`);
          }
          return result;
        } catch (error) {
          this.notifyError("Medicine", `${error}`);
          throw error;
        }
      })
    );
  }

  async addUnit(units: UnitProps[]) {
    await Promise.all(
      units.map(async unit => {
        try {
          const result = await this.appService.unitService.create({
            data: unit,
          });
          if (result instanceof Message) {
            this.notifyError("Unit", `${result.type}: ${result.content}`);
          }
          return result;
        } catch (error) {
          this.notifyError("Unit", `${error}`);
          throw error;
        }
      })
    );
  }

  async addMilk(milks: Milk[]) {
    await Promise.all(
      milks.map(async milk => {
        try {
          const result = await this.appService.milkService.create({
            data: milk,
          });
          if (result instanceof Message) {
            this.notifyError("Milk", `${result.type}: ${result.content}`);
          }
          return result;
        } catch (error) {
          this.notifyError("Milk", `${error}`);
          throw error;
        }
      })
    );
  }

  async addComplication(complications: ComplicationDto[]) {
    await Promise.all(
      complications.map(async complication => {
        try {
          const result = await this.appService.complicationService.create({
            data: complication,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Complication",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Complication", `${error}`);
          throw error;
        }
      })
    );
  }

  async addNextClinicalRef(nextClinicalRefs: Next_ClinicalSignReference[]) {
    await Promise.all(
      nextClinicalRefs.map(async clinicalRef => {
        try {
          const result = await this.appService.nextClinicalRefService.create({
            code: clinicalRef.code,
            description: clinicalRef.description,
            name: clinicalRef.name,
            neededDataFields: clinicalRef.data,
            rule: clinicalRef.evaluationRule,
          });
          if (result instanceof Message) {
            this.notifyError(
              "Next Clinical Refs",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Next Clinical Refs", `${error}`);
          throw error;
        }
      })
    );
  }

  async addDataFields(dataFields: DataFieldReference[]) {
    await Promise.all(
      dataFields.map(async field => {
        try {
          const result = await this.appService.dataFieldService.create({
            ...field,
          });
          if (result instanceof Message) {
            this.notifyError(
              "data fields refs",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("data fields refs", `${error}`);
          throw error;
        }
      })
    );
  }
  async addNextAppetiteTestRef(appetiteTestRefs: AppetiteTestRef[]) {
    await Promise.all(
      appetiteTestRefs.map(async ref => {
        try {
          const result = await this.appService.evaluationAppetiteTest.create({
            data: {
              appetiteTestTable: ref.appetiteTestTable as any,
              code: ref.code,
              name: ref.name,
              neededDataFields: ref.neededDataFields,
              productType: ref.productType,
            },
          });
          if (result instanceof Message) {
            this.notifyError(
              "Next Appetite Test Reference",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Next Appetite Test Reference", `${error}`);
          throw error;
        }
      })
    );
  }

  async addCarePhase(carePhases: CarePhaseReference[]) {
    await Promise.all(
      carePhases.map(async carePhase => {
        try {
          const result =
            await this.appService.carePhaseReferenceService.create(
              {
                data: {
                  applicabilyConditions: carePhase.applicabilyConditions,
                  code: carePhase.code,
                  description: carePhase.description,
                  failureCriteria: carePhase.failureCriteria,
                  followUpPlan: carePhase.followUpPlan.map((plan) => ({
                    applicabilities: plan.applicabilities,
                    treatmentToApply: plan.treatmentToApply.map(recommendedTreatment => recommendedTreatment.identifier as any)
                  })),
                  monitoringPlan: carePhase.monitoringPlan.map((plan) => ({
                    category: plan.category,
                    code: plan.code,
                    duration: plan.duration as any,
                    frequency: plan.frequency as any,
                    source: plan.source
                  })),
                  name: carePhase.name,
                  transitionCriteria: carePhase.transitionCriteria,
                  recommendedTreatments: carePhase.recommendedTreatments.map(treatment => ({
                    applicabilyCondition: {
                      condition: treatment.applicabilityCondition.condition,
                      description: treatment.applicabilityCondition.descritpion,
                      variablesExplanation: treatment.applicabilityCondition.variablesExplanation
                    },
                    code: treatment.identifier as any,
                    type: treatment.type,
                    treatmentCode: treatment.code,
                    duration: treatment.duration as any,
                    frequency: treatment.frequency as any,
                    triggers: {
                      onEnd: treatment.triggers?.onEnd?.map(trigger => ({
                        action: trigger.action as any,
                        targetTreatment: trigger.targetCode
                      })) || [],
                      onStart: treatment.triggers?.onStart?.map(trigger => ({
                        action: trigger.action as any,
                        targetTreatment: trigger.targetCode
                      })) || []
                    }
                  }))
                }
              }
            );
          const followUpRecommendedTreatmentResult = await Promise.all(carePhase.followUpPlan.flatMap(plan => plan.treatmentToApply.map(treatment => this.appService.carePhaseReferenceService.createRecommendedTreatment({
            data: {
              applicabilyCondition: {
                condition: treatment.applicabilityCondition.condition,
                description: treatment.applicabilityCondition.descritpion,
                variablesExplanation: treatment.applicabilityCondition.variablesExplanation
              },
              code: treatment.identifier as any,
              type: treatment.type,
              treatmentCode: treatment.code,
              duration: treatment.duration as any,
              frequency: treatment.frequency as any,
              triggers: {
                onEnd: treatment.triggers?.onEnd?.map(trigger => ({
                  action: trigger.action as any,
                  targetTreatment: trigger.targetCode
                })) || [],
                onStart: treatment.triggers?.onStart?.map(trigger => ({
                  action: trigger.action as any,
                  targetTreatment: trigger.targetCode
                })) || []
              }
            }
          }))))

          if (result instanceof Message) {
            this.notifyError("Care Phase", `${result.type}: ${result.content}`);
          }
          followUpRecommendedTreatmentResult.forEach(res => res instanceof Message && this.notifyError("Care Phase", `${res.type}: ${res.content}`));
          return result;
        } catch (error) {
          this.notifyError("Care Phase", `${error}`);
          throw error;
        }
      })
    );
  }

  async addNextMedicine(medicines: Next_Medicine[]) {
    await Promise.all(
      medicines.map(async medicine => {
        try {
          const result =
            await this.appService.nextMedicineService.create(
              {
                data: {
                  name: medicine.name,
                  administrationRoutes: medicine.administrationRoutes,
                  category: medicine.category,
                  code: medicine.code,
                  contraindications: medicine.contraindications ?? [],
                  dosageCases: medicine.dosageCases.map(dosage => ({
                    base: dosage.baseDosage,
                    condition: dosage.dosageCondition,
                    ranges: dosage.dosageRanges
                  })),
                  interactions: medicine.interactions ?? [],
                  notes: medicine.notes ?? [],
                  warnings: medicine.warnings ?? []
                }
              }
            );
          if (result instanceof Message) {
            this.notifyError(
              "Next Medicine",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Next Medicine", `${error}`);
          throw error;
        }
      })
    );
  }

  async addNextNutritionalProduct(products: NutitionalProduct[]) {
    await Promise.all(
      products.map(async product => {
        try {
          const result =
            await this.appService.nextNutritionalProductService.create(
              {
                data: {
                  code: product.code,
                  dosageTables: product.dosageTables.map(table => ({
                    applicability: {
                      condition: table.applicability.condition,
                      description: table.applicability.descritption,
                      variablesExplanation: table.applicability.variablesExplanation
                    },
                    conditionalDosageFormulas: table.conditionalDosageFormulas.map(formula => ({
                      applicabilities: formula.applicabilities.map(criterion => ({
                        description: criterion.description,
                        condition: criterion.condition,
                        variablesExplanation: criterion.variablesExplanation
                      })),
                      formula: {
                        min: formula.formula.min,
                        max: formula.formula.max,
                        unit: formula.formula.unit,
                        description: formula.formula.desciption,
                        variablesExplanation: formula.formula.variablesExplanation
                      }
                    })),
                    dosages: table.dosages,
                    isAdmissionWeight: table.isAdmissionWeight
                  }))
                }
              }
            );
          if (result instanceof Message) {
            this.notifyError(
              "Next Nutritional Product",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Next Nutritional Product", `${error}`);
          throw error;
        }
      })
    );
  }

  async addNextMilk(milks: MilkEntity[]) {
    await Promise.all(
      milks.map(async milk => {
        try {
          const result =
            await this.appService.nextMilkService.create({
              data: milk
            });
          if (result instanceof Message) {
            this.notifyError("Next Milk", `${result.type}: ${result.content}`);
          }
          return result;
        } catch (error) {
          this.notifyError("Next Milk", `${error}`);
          throw error;
        }
      })
    );
  }

  async addNextOrientationRef(orientations: Next_OrientationRef[]) {
    await Promise.all(
      orientations.map(async orientation => {
        try {
          const result =
            await this.appService.nextOrientationService.create(
              {
                code: orientation.code,
                criteria: orientation.criteria,
                name: orientation.name,
                treatmentPhase: orientation.treatmentPhase
              }
            );
          if (result instanceof Message) {
            this.notifyError(
              "Next Orientation",
              `${result.type}: ${result.content}`
            );
          }
          return result;
        } catch (error) {
          this.notifyError("Next Orientation", `${error}`);
          throw error;
        }
      })
    );
  }

  prepareData(data: Map<string, string>): PediatricSoftwareData {
    return {
      measures: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.anthropometricMeasure.filePath,
        data
      ),
      appetiteTestRefs: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.appetiteTestRef.filePath,
        data
      ),
      biochemicalReferences: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.biochemicalRef.filePath,
        data
      ),
      clinicalSigns: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.clinicalRef.filePath,
        data
      ),
      complications: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.complications.filePath,
        data
      ),
      diagnosticRules: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.diagnosticRules.filePath,
        data
      ),
      growthReferenceCharts: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.charts.filePath,
        data
      ),
      growthReferenceTables: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.tables.filePath,
        data
      ),
      indicators: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.indicators.filePath,
        data
      ),
      medicines: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.medicine.filePath,
        data
      ),
      milks: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.milks.filePath,
        data
      ),
      orientationRefs: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.orientationRef.filePath,
        data
      ),
      units: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.units.filePath,
        data
      ),
      nutritionalRiskFactors: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.nutritionalRiskFactors.filePath,
        data
      ),
      nextClinicalSigns: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.nextClinicalRef.filePath,
        data
      ),
      dataFields: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.dataFields.filePath,
        data
      ),
      carePhases: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.carePhases.filePath,
        data
      ),
      nextMedicines: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.nextMedicine.filePath,
        data
      ),
      nutritionalProducts: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.nutritionalProduct.filePath,
        data
      ),
      nextMilks: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.milkEntitie.filePath,
        data
      ),
      nextOrientations: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.nextOrientationRef.filePath,
        data
      ),
      nextAppetiteTestRefs: this.jsonToObj(
        PediatricSoftwareDataZipFileArch.appetiteTestRef.filePath,
        data
      ),
    };
  }
  jsonToObj<T>(filePath: string[] | string, data: Map<string, string>): T[] {
    const obj: T[] = [];
    if (Array.isArray(filePath)) {
      filePath.forEach(path => {
        const jsonData = data.get(path);
        if (!jsonData) {
          console.error("[Error] : undefined value", path);
          return;
        }
        const jsonToObj = JSON.parse(jsonData);
        obj.push(jsonToObj as T);
      });
    } else if (typeof filePath === "string") {
      const jsonData = data.get(filePath);
      if (!jsonData) {
        console.error("[Error] : undefined value", filePath);
        return obj;
      }
      const jsonToObj = JSON.parse(jsonData);
      const array = Array.isArray(jsonToObj) ? jsonToObj : [jsonToObj];
      obj.push(...array);
    } else {
      console.error("Errors ");
    }
    return obj;
  }
}
