import {
  PatientCurrentState,
  PatientCurrentStateRepository,
} from "@core/nutrition_care";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { PatientCurrentStatePersistenceDto } from "../../dtos";

export class PatientCurrentStateRepositoryWebImpl
  extends EntityBaseRepositoryWeb<
    PatientCurrentState,
    PatientCurrentStatePersistenceDto
  >
  implements PatientCurrentStateRepository
{
  protected storeName = "patient_current_states";
}
