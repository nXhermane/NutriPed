import {
  AggregateID,
  Entity,
  EntityPropsBaseType,
  handleError,
  Result,
} from "@shared";
import {
  GrowthIndicatorValue,
  CreateGrowthIndicatorValueProps,
} from "../../../anthropometry";
import {
  BiologicalAnalysisInterpretation,
  CreateBiologicalAnalysisInterpretationProps,
} from "../../../biological";
import { GlobalDiagnostic } from "../valueObjects";
import {
  ClinicalNutritionalAnalysisResult,
  CreateClinicalNutritionalAnalysisResultProps,
} from "../../../clinical";

export interface INutritionalAssessmentResult extends EntityPropsBaseType {
  growthIndicatorValues: GrowthIndicatorValue[];
  clinicalAnalysis: ClinicalNutritionalAnalysisResult[];
  biologicalInterpretation: BiologicalAnalysisInterpretation[];
  globalDiagnostics: GlobalDiagnostic[];
}
export type CreateNutritionalAssessmentResult = {
  globalDiagnostics: { code: string; criteriaUsed: string[] }[];
  growthIndicatorValues: CreateGrowthIndicatorValueProps[];
  clinicalAnalysis: CreateClinicalNutritionalAnalysisResultProps[];
  biologicalInterpretation: CreateBiologicalAnalysisInterpretationProps[];
};

export class NutritionalAssessmentResult extends Entity<INutritionalAssessmentResult> {
  getGrowthIndicatorValues(): GrowthIndicatorValue[] {
    return this.props.growthIndicatorValues;
  }
  getClinicalAnalysis(): ClinicalNutritionalAnalysisResult[] {
    return this.props.clinicalAnalysis;
  }
  getBiologicalInterpretation(): BiologicalAnalysisInterpretation[] {
    return this.props.biologicalInterpretation;
  }
  getGlobalDiagnostics(): GlobalDiagnostic[] {
    return this.props.globalDiagnostics;
  }
  changeGlobalDiagnostic(globalDiagnostic: GlobalDiagnostic) {
    this.props.globalDiagnostic = globalDiagnostic;
    this.validate();
  }
  addGrowthIndicatorValues(...growthIndicatorValues: GrowthIndicatorValue[]) {
    for (const growthIndicatorValue of growthIndicatorValues) {
      const growthIndicatorValueIndex =
        this.props.growthIndicatorValues.findIndex(
          growthInd =>
            growthInd.unpack().code === growthIndicatorValue.unpack().code
        );
      if (growthIndicatorValueIndex != -1)
        this.props.growthIndicatorValues[growthIndicatorValueIndex] =
          growthIndicatorValue;
      else this.props.growthIndicatorValues.push(growthIndicatorValue);
    }
    this.validate();
  }
  addClinicalAnalysis(
    ...clinicalAnalysis: ClinicalNutritionalAnalysisResult[]
  ) {
    for (const clinical of clinicalAnalysis) {
      const clinicalIndex = this.props.clinicalAnalysis.findIndex(clinic =>
        clinic.unpack().clinicalSign.equals(clinical.unpack().clinicalSign)
      );
      if (clinicalIndex != -1)
        this.props.clinicalAnalysis[clinicalIndex] = clinical;
      else this.props.clinicalAnalysis.push(clinical);
    }
    this.validate();
  }
  addBiologicalAnalysisInterpretations(
    ...biologicalAnalysis: BiologicalAnalysisInterpretation[]
  ) {
    for (const biologicalAnalyze of biologicalAnalysis) {
      const biologicalAnalyzeIndex =
        this.props.biologicalInterpretation.findIndex(
          bioAna => bioAna.unpack().code === biologicalAnalyze.unpack().code
        );
      if (biologicalAnalyzeIndex != -1)
        this.props.biologicalInterpretation[biologicalAnalyzeIndex] =
          biologicalAnalyze;
      else this.props.biologicalInterpretation.push(biologicalAnalyze);
    }
    this.validate();
  }

  removeGrowthIndicatorValue(...growthIndicatorValues: GrowthIndicatorValue[]) {
    for (const growthIndicatorValue of growthIndicatorValues) {
      const index = this.props.growthIndicatorValues.findIndex(growthInd =>
        growthInd.equals(growthIndicatorValue)
      );
      if (index !== -1) this.props.growthIndicatorValues.splice(index, 1);
    }
    this.validate();
  }

  removeClinicalAnalysis(
    ...clinicalAnalysis: ClinicalNutritionalAnalysisResult[]
  ) {
    for (const clinical of clinicalAnalysis) {
      const index = this.props.clinicalAnalysis.findIndex(clinic =>
        clinic.equals(clinical)
      );
      if (index !== -1) this.props.clinicalAnalysis.splice(index, 1);
    }
    this.validate();
  }

  removeBiologicalAnalysisInterpretation(
    ...biologicalInterpretations: BiologicalAnalysisInterpretation[]
  ) {
    for (const biologicalInterpretation of biologicalInterpretations) {
      const index = this.props.biologicalInterpretation.findIndex(analysis =>
        analysis.unpack().code.equals(biologicalInterpretation.unpack().code)
      );
      if (index !== -1) this.props.biologicalInterpretation.splice(index, 1);
    }
    this.validate();
  }

  public validate(): void {
    // Write a validation code if it's need I
    this._isValid = true;
  }
  static create(
    createProps: CreateNutritionalAssessmentResult,
    id: AggregateID
  ): Result<NutritionalAssessmentResult> {
    try {
      const globalDiagnosticsRes = createProps.globalDiagnostics.map(
        diagnostic =>
          GlobalDiagnostic.create(diagnostic.code, diagnostic.criteriaUsed)
      );
      const growthIndicatorValuesRes = createProps.growthIndicatorValues.map(
        GrowthIndicatorValue.create
      );
      const clinicalAnalysisRes = createProps.clinicalAnalysis.map(
        ClinicalNutritionalAnalysisResult.create
      );
      const biologicalAnalysisInterpretationRes =
        createProps.biologicalInterpretation.map(
          BiologicalAnalysisInterpretation.create
        );
      const combinedRes = Result.combine([
        ...globalDiagnosticsRes,
        ...growthIndicatorValuesRes,
        ...clinicalAnalysisRes,
        ...biologicalAnalysisInterpretationRes,
      ]);
      if (combinedRes.isFailure) return Result.fail(String(combinedRes.err));
      return Result.ok(
        new NutritionalAssessmentResult({
          id,
          props: {
            globalDiagnostics: globalDiagnosticsRes.map(valRes => valRes.val),
            growthIndicatorValues: growthIndicatorValuesRes.map(
              valRes => valRes.val
            ),
            clinicalAnalysis: clinicalAnalysisRes.map(valRes => valRes.val),
            biologicalInterpretation: biologicalAnalysisInterpretationRes.map(
              valRes => valRes.val
            ),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
