import {
  Result,
  handleError,
  DomainService,
  AggregateID,
} from "@shared";
import { CarePhase } from "../models/entities/CarePhase";
import { PatientCareSession } from "../models/aggregates/PatientCareSession";
import { PhaseTransitionEvent } from "../events/PhaseTransitionEvent";

export interface PhaseTransitionRequest {
  sessionId: AggregateID;
  fromPhaseId: AggregateID;
  toPhaseId: AggregateID;
  patientData: { [key: string]: any };
  reason: string;
  performedBy: string;
}

export interface PhaseTransitionResult {
  success: boolean;
  transitionId: string;
  fromPhase: string;
  toPhase: string;
  transitionDate: Date;
  validationResults: ValidationResult[];
  warnings: string[];
  events: PhaseTransitionEvent[];
}

export interface ValidationResult {
  criterion: string;
  passed: boolean;
  actualValue: any;
  expectedValue: any;
  message: string;
}

export enum TransitionValidationType {
  ENTRY_CONDITIONS = "entry_conditions",
  EXIT_CONDITIONS = "exit_conditions",
  DURATION_REQUIREMENTS = "duration_requirements",
  CONTRAINDICATIONS = "contraindications",
  REQUIRED_ASSESSMENTS = "required_assessments"
}

export class PhaseTransitionService extends DomainService {
  constructor() {
    super();
  }

  // Main method to evaluate and execute phase transition
  async evaluateTransition(
    request: PhaseTransitionRequest,
    currentPhase: CarePhase,
    targetPhase: CarePhase,
    session: PatientCareSession
  ): Promise<Result<PhaseTransitionResult>> {
    try {
      const validationResults: ValidationResult[] = [];
      const warnings: string[] = [];
      const events: PhaseTransitionEvent[] = [];

      // 1. Validate exit conditions from current phase
      const exitValidation = this.validateExitConditions(
        currentPhase,
        request.patientData,
        session
      );
      validationResults.push(...exitValidation.validationResults);
      warnings.push(...exitValidation.warnings);

      // 2. Validate entry conditions for target phase
      const entryValidation = this.validateEntryConditions(
        targetPhase,
        request.patientData
      );
      validationResults.push(...entryValidation.validationResults);
      warnings.push(...entryValidation.warnings);

      // 3. Check contraindications
      const contraindicationValidation = this.validateContraindications(
        targetPhase,
        request.patientData
      );
      validationResults.push(...contraindicationValidation.validationResults);
      warnings.push(...contraindicationValidation.warnings);

      // 4. Validate required assessments
      const assessmentValidation = this.validateRequiredAssessments(
        targetPhase,
        request.patientData
      );
      validationResults.push(...assessmentValidation.validationResults);
      warnings.push(...assessmentValidation.warnings);

      // 5. Check if all critical validations passed
      const criticalFailures = validationResults.filter(
        result => !result.passed && this.isCriticalValidation(result.criterion)
      );

      const canTransition = criticalFailures.length === 0;

      if (canTransition) {
        // Create transition event
        const transitionEvent = PhaseTransitionEvent.create({
          sessionId: request.sessionId,
          fromPhaseId: request.fromPhaseId,
          toPhaseId: request.toPhaseId,
          transitionDate: new Date(),
          reason: request.reason,
          performedBy: request.performedBy,
          patientData: request.patientData,
          validationResults,
        });

        if (transitionEvent.isSuccess) {
          events.push(transitionEvent.val);
        }
      }

      const result: PhaseTransitionResult = {
        success: canTransition,
        transitionId: this.generateTransitionId(),
        fromPhase: currentPhase.name,
        toPhase: targetPhase.name,
        transitionDate: new Date(),
        validationResults,
        warnings,
        events,
      };

      return Result.ok(result);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  // Validate exit conditions from current phase
  private validateExitConditions(
    currentPhase: CarePhase,
    patientData: { [key: string]: any },
    session: PatientCareSession
  ): { validationResults: ValidationResult[]; warnings: string[] } {
    const validationResults: ValidationResult[] = [];
    const warnings: string[] = [];

    const exitConditions = currentPhase.transitionCriteria.exitConditions;

    exitConditions.forEach(condition => {
      const actualValue = patientData[condition.parameter];
      const passed = this.evaluateCondition(condition, actualValue);

      validationResults.push({
        criterion: `exit_${condition.parameter}`,
        passed,
        actualValue,
        expectedValue: condition.value,
        message: passed 
          ? `Exit condition met: ${condition.description}`
          : `Exit condition not met: ${condition.description}`,
      });

      if (!passed) {
        warnings.push(`Patient may not be ready to exit ${currentPhase.name}: ${condition.description}`);
      }
    });

    // Check minimum duration
    const currentPhaseDuration = this.calculatePhaseDuration(session, currentPhase.getId());
    const minDuration = currentPhase.transitionCriteria.minimumDuration;
    
    const durationMet = currentPhaseDuration >= minDuration;
    validationResults.push({
      criterion: "minimum_duration",
      passed: durationMet,
      actualValue: currentPhaseDuration,
      expectedValue: minDuration,
      message: durationMet
        ? `Minimum duration requirement met (${currentPhaseDuration}/${minDuration} days)`
        : `Minimum duration not met (${currentPhaseDuration}/${minDuration} days)`,
    });

    return { validationResults, warnings };
  }

  // Validate entry conditions for target phase
  private validateEntryConditions(
    targetPhase: CarePhase,
    patientData: { [key: string]: any }
  ): { validationResults: ValidationResult[]; warnings: string[] } {
    const validationResults: ValidationResult[] = [];
    const warnings: string[] = [];

    const entryConditions = targetPhase.transitionCriteria.entryConditions;

    entryConditions.forEach(condition => {
      const actualValue = patientData[condition.parameter];
      const passed = this.evaluateCondition(condition, actualValue);

      validationResults.push({
        criterion: `entry_${condition.parameter}`,
        passed,
        actualValue,
        expectedValue: condition.value,
        message: passed
          ? `Entry condition met: ${condition.description}`
          : `Entry condition not met: ${condition.description}`,
      });

      if (!passed) {
        warnings.push(`Patient may not be ready for ${targetPhase.name}: ${condition.description}`);
      }
    });

    return { validationResults, warnings };
  }

  // Validate contraindications
  private validateContraindications(
    targetPhase: CarePhase,
    patientData: { [key: string]: any }
  ): { validationResults: ValidationResult[]; warnings: string[] } {
    const validationResults: ValidationResult[] = [];
    const warnings: string[] = [];

    const contraindications = targetPhase.transitionCriteria.contraindications;

    contraindications.forEach(contraindication => {
      // Check if contraindication exists in patient data
      const hasContraindication = this.checkContraindication(contraindication, patientData);

      validationResults.push({
        criterion: `contraindication_${contraindication}`,
        passed: !hasContraindication,
        actualValue: hasContraindication,
        expectedValue: false,
        message: hasContraindication
          ? `Contraindication present: ${contraindication}`
          : `No contraindication: ${contraindication}`,
      });

      if (hasContraindication) {
        warnings.push(`Contraindication for ${targetPhase.name}: ${contraindication}`);
      }
    });

    return { validationResults, warnings };
  }

  // Validate required assessments
  private validateRequiredAssessments(
    targetPhase: CarePhase,
    patientData: { [key: string]: any }
  ): { validationResults: ValidationResult[]; warnings: string[] } {
    const validationResults: ValidationResult[] = [];
    const warnings: string[] = [];

    const requiredAssessments = targetPhase.transitionCriteria.getMandatoryAssessments();

    requiredAssessments.forEach(assessment => {
      const assessmentKey = `assessment_${assessment.assessmentType}`;
      const assessmentData = patientData[assessmentKey];
      const passed = assessmentData && this.evaluateAssessment(assessment, assessmentData);

      validationResults.push({
        criterion: `assessment_${assessment.assessmentType}`,
        passed,
        actualValue: assessmentData,
        expectedValue: assessment.passingCriteria,
        message: passed
          ? `Required assessment completed: ${assessment.assessmentType}`
          : `Required assessment missing or failed: ${assessment.assessmentType}`,
      });

      if (!passed) {
        warnings.push(`Missing or failed assessment for ${targetPhase.name}: ${assessment.assessmentType}`);
      }
    });

    return { validationResults, warnings };
  }

  // Helper methods
  private evaluateCondition(condition: any, actualValue: any): boolean {
    // Implementation would depend on the condition operator
    // This is a simplified version
    switch (condition.operator) {
      case "greater_than":
        return Number(actualValue) > Number(condition.value);
      case "less_than":
        return Number(actualValue) < Number(condition.value);
      case "equal":
        return actualValue === condition.value;
      default:
        return false;
    }
  }

  private checkContraindication(contraindication: string, patientData: { [key: string]: any }): boolean {
    // Check if contraindication exists in patient data
    return patientData.contraindications?.includes(contraindication) || false;
  }

  private evaluateAssessment(assessment: any, assessmentData: any): boolean {
    // Evaluate if assessment meets passing criteria
    // This would be more complex in real implementation
    return assessmentData.status === "passed";
  }

  private calculatePhaseDuration(session: PatientCareSession, phaseId: AggregateID): number {
    // Calculate how long the patient has been in the current phase
    // This would require access to session history
    return 0; // Placeholder
  }

  private isCriticalValidation(criterion: string): boolean {
    const criticalCriteria = [
      "contraindication",
      "entry_weight",
      "entry_appetite_test",
      "exit_complications"
    ];
    return criticalCriteria.some(critical => criterion.includes(critical));
  }

  private generateTransitionId(): string {
    return `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
