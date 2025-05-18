import {
  AppetiteTestRef,
  AppetiteTestRefRepository,
} from "@core/nutrition_care";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { AppetiteTestReferencePersistenceDto } from "../../dtos";
import { appetite_test_references } from "../db";

export class AppetiteTestRefRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    AppetiteTestRef,
    AppetiteTestReferencePersistenceDto,
    typeof appetite_test_references
  >
  implements AppetiteTestRefRepository {}
