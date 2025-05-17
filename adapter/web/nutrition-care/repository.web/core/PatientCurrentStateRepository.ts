
import { PatientCurrentState, PatientCurrentStateRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../common";
import { PatientCurrentStatePersistenceDto } from "../../mappers";

export class PatientCurrentStateRepositoryImpl 
    extends EntityBaseRepository<PatientCurrentState, PatientCurrentStatePersistenceDto> 
    implements PatientCurrentStateRepository {
    
    protected storeName = "patient_current_states";
}