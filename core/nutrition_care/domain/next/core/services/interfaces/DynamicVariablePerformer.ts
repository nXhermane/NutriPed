import { Result } from "@/core/shared";
import { PatientCareSession } from "../../models";

export interface IDynamicVariablePerformer {
  generateVariable(
    patientCareSession: PatientCareSession
  ): Promise<Result<Record<string, number>>>;
}

/**
 * C'est ce service qui va s'occuper de la generation des variables dynamique;
 */
/** 
 * Je pense que je dois creer un service qui va s'occuper de calculer toutes les variables necessaire en prenant en parametre le patient session care.
 */ 