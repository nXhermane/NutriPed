import {
  PatientCurrentState,
  PatientCurrentStateRepository,
} from "@core/nutrition_care";
import { EntityBaseRepositoryExpo } from "../../../../shared";
import { PatientCurrentStatePersistenceDto } from "../../dtos";
import { patient_current_states } from "../db";

export class PatientCurrentStateRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    PatientCurrentState,
    PatientCurrentStatePersistenceDto,
    typeof patient_current_states
  >
  implements PatientCurrentStateRepository {}
