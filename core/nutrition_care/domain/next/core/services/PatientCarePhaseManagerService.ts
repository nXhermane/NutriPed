import { CARE_PHASE_CODES } from "@/core/constants";
import {
  SystemCode,
  AggregateID,
  Result,
  GenerateUniqueId,
  DomainDateTime,
  handleError,
  formatError,
} from "@/core/shared";
import { CarePhase } from "../models";
import {
  ICarePhaseManagerService,
  ICarePlanApplicatorService,
  ICareSessionVariableGeneratorService,
  PhaseEvaluationResult,
} from "./interfaces";
import {
  CarePhaseDecision,
  ICarePhaseReferenceOrchestrator,
} from "../../../modules";

export class CarePhaseManagerService implements ICarePhaseManagerService {
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly carePhaseRefService: ICarePhaseReferenceOrchestrator,
    private readonly careSessionVariableGenerator: ICareSessionVariableGeneratorService,
    private readonly carePlanApplicator: ICarePlanApplicatorService
  ) {}
  async generate(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    patientId: AggregateID,
    targetDate: DomainDateTime = DomainDateTime.now()
  ): Promise<Result<CarePhase>> {
    try {
      // 1. on creer le care phase maintenant avec un plan de traitement vide
      const newId = this.idGenerator.generate().toValue();
      const carePhaseResult = CarePhase.create(
        {
          code: carePhaseCode.unpack(),
          monitoringParameters: [],
          onGoingTreatments: [],
        },
        newId
      );
      if (carePhaseResult.isFailure) {
        return Result.fail(
          formatError(carePhaseResult, CarePhaseManagerService.name)
        );
      }
      // 2. on generer le context initial puisque c'est une nouvelle génération de phase
      const initalContextRes =
        await this.careSessionVariableGenerator.generateIntialVariables(
          patientId,
          targetDate
        );
      if (initalContextRes.isFailure) {
        return Result.fail(
          formatError(initalContextRes, CarePhaseManagerService.name)
        );
      }
      // 3. on genere les traitements initaux de cette phase a partir du context a partir de ce context.
      const phaseRecommendationPlanResult =
        await this.carePhaseRefService.determineApplicableCare(
          carePhaseCode,
          initalContextRes.val as any
        );
      if (phaseRecommendationPlanResult.isFailure) {
        return Result.fail(
          formatError(
            phaseRecommendationPlanResult,
            CarePhaseManagerService.name
          )
        );
      }

      // 4. on va maintenant lancer l'applicateur de plan de traitement
      const carePhase = carePhaseResult.val;
      const planApplicationResult = await this.carePlanApplicator.applyPlan(
        phaseRecommendationPlanResult.val,
        carePhase
      );
      if (planApplicationResult.isFailure) {
        return Result.fail(
          formatError(planApplicationResult, CarePhaseManagerService.name)
        );
      }
      // 5. Si tout ce passe bien on retourne le care phase générer
      return Result.ok(carePhase);
    } catch (e) {
      return handleError(e);
    }
  }
  async evaluate(
    carePhase: CarePhase,
    patientId: AggregateID,
    targetDate: DomainDateTime
  ): Promise<Result<PhaseEvaluationResult>> {
    try {
      // 1. On va directement générer le context
      const evaluationContextResult =
        await this.careSessionVariableGenerator.generateEvaluationVariables(
          patientId,
          carePhase,
          targetDate
        );
      if (evaluationContextResult.isFailure) {
        return Result.fail(
          formatError(evaluationContextResult, CarePhaseManagerService.name)
        );
      }
      // 2. On va maintenant appélé le service d'évaluation
      const carePhaseEvaluationResult =
        await this.carePhaseRefService.evaluatePhaseStatus(
          carePhase.getProps().code,
          evaluationContextResult.val as any
        );
      if (carePhaseEvaluationResult.isFailure) {
        return Result.fail(
          formatError(carePhaseEvaluationResult, CarePhaseManagerService.name)
        );
      }
      // 3. On va examiner le resultat de l'évaluation
      const decision = carePhaseEvaluationResult.val.decision;
      switch (decision) {
        case CarePhaseDecision.FAILURE:
        case CarePhaseDecision.TRANSITION_TO_NEXT: {
          // Dans ce cas on retourne un objet qui va servir a la prise de décision `Notre fameux message`
          return Result.ok({
            decision,
            tragetPhase: carePhaseEvaluationResult.val.nextPhaseCode,
          });
        }
        case CarePhaseDecision.CONTINUE: {
          // Dans ce cas on va essayer d'appeler la generation de plan initial et aussi de plan d'ajustement;
          // 3.a : on va generer le plan inital et l'appliquer
          // 3.a.1 - Generer
          const phaseRecommendationPlanResult =
            await this.carePhaseRefService.determineApplicableCare(
              carePhase.getProps().code,
              evaluationContextResult.val as any
            );
          if (phaseRecommendationPlanResult.isFailure) {
            return Result.fail(
              formatError(
                phaseRecommendationPlanResult,
                CarePhaseManagerService.name
              )
            );
          }
          // 3.a.2 - Appliquer
          const planApplicationResult = await this.carePlanApplicator.applyPlan(
            phaseRecommendationPlanResult.val,
            carePhase
          );
          if (planApplicationResult.isFailure) {
            return Result.fail(
              formatError(planApplicationResult, CarePhaseManagerService.name)
            );
          }
          // 3.b: on va generer le plan d'ajustement et l'appliquer
          // 3.b.1 : Générer
          const phaseAdjustementPlanResult =
            await this.carePhaseRefService.ajustOnGoingCarePlan(
              carePhase.getProps().code,
              evaluationContextResult.val as any
            );
          if (phaseAdjustementPlanResult.isFailure) {
            return Result.fail(
              formatError(
                phaseAdjustementPlanResult,
                CarePhaseManagerService.name
              )
            );
          }
          // 3.b.2 : Appliquer
          const adjustedPlanApplicationResult =
            await this.carePlanApplicator.applyAjustments(
              phaseAdjustementPlanResult.val,
              carePhase
            );
          if (adjustedPlanApplicationResult.isFailure) {
            return Result.fail(
              formatError(
                adjustedPlanApplicationResult,
                CarePhaseManagerService.name
              )
            );
          }
          // if all is done just return continue decision
          return Result.ok({
            decision,
          });
        }
        default:
          return Result.fail(
            `This evaluation decision is not supported by the systeme. ${decision}`
          );
      }
    } catch (e) {
      return handleError(e);
    }
  }
}
