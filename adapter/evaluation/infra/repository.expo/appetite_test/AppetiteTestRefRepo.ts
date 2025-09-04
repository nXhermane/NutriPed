import { AppetiteTestRef, AppetiteTestRefRepository } from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { AppetiteTestReferencePersistenceDto } from "../../dtos";
import { next_appetite_test_references } from "../db";

export class AppetiteTestRefRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    AppetiteTestRef,
    AppetiteTestReferencePersistenceDto,
    typeof next_appetite_test_references
  >
  implements AppetiteTestRefRepository {}
