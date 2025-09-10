import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, DomainDateTime, Result, SystemCode } from "@/core/shared";
import { CarePhase } from "../../models";
import { CarePhaseDecision } from "@/core/nutrition_care/domain/modules";

export type PhaseEvaluationResult =
  | {
      decision:
        | CarePhaseDecision.FAILURE
        | CarePhaseDecision.TRANSITION_TO_NEXT;
      tragetPhase?: CARE_PHASE_CODES;
    }
  | {
      decision: CarePhaseDecision.CONTINUE;
    };
export interface ICarePhaseManagerService {
  /**
   * Elle permet de générer une nouvelle phase pour le patient.
   * @param carePhaseCode le code de la phase a commencer retourner par le context d'orientation
   * @param patientId C'est l'id du patient qui veux commencer la phase de traitement. Cela va nous aider dans la recuperation du context.
   */
  generate(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    patientId: AggregateID,
    targetDate?: DomainDateTime
  ): Promise<Result<CarePhase>>;
  /**
   * Elle evalue la phase de traitement , detecte les echecs, les transitions (REUSSITE) ou continuer avec la phase en cours.
   * Après cela elle s'occupe en meme temps de générer les traitements
   * @param carePhase Une phase de traitment dans lequel se trouve le patient.
   * @param patientId
   */
  evaluate(
    carePhase: CarePhase,
    patientId: AggregateID,
    targetDate: DomainDateTime
  ): Promise<Result<PhaseEvaluationResult>>;
}
/**
 * Comme on voulais interagir avec le user lors de cette etape d'echec ou de transisiton,
 *  on peut intégrer quelque chose dans le patient care session, qui peut s'appeler la décision.
 * et la réponse. si nous voulons communiquer avec le user on peut formuler un message (par un vrais message hein)
 * et tant que ce message n'est pas reply, on peut plus continuer avec les choses du traitment
 * un fois repondu, on peut avoir la boite au lettre vide et une reponse qui nous ai retouner.
 * dans ce cas specifique il  peut s'agir de changement de phase. de cette maniere. on bien on peut aussi permettre au use de nous envoyer de message aussi et on interprete cela pour prendre de decision sur le traitement a executer
 *  Ce serai génial mais on a pas encore une structure de donnée particuliere en tete.
 * on peut aussi prendre par ce canle pour informer le user que le domaine manque de variables
 */
