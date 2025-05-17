import { PatientCurrentState, PatientCurrentStateRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../../shared";
import { PatientCurrentStatePersistenceDto } from "../../dtos";

export class PatientCurrentStateRepositoryWebImpl 
    extends EntityBaseRepository<PatientCurrentState, PatientCurrentStatePersistenceDto> 
    implements PatientCurrentStateRepository {
    
    protected storeName = "patient_current_states";
}