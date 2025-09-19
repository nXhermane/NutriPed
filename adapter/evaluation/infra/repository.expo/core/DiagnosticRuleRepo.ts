import { DiagnosticRule, DiagnosticRuleRepository } from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { DiagnosticRulePersistenceDto } from "../..";
import { diagnostic_rules } from "../db";

export class DiagnosticRuleRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    DiagnosticRule,
    DiagnosticRulePersistenceDto,
    typeof diagnostic_rules
  >
  implements DiagnosticRuleRepository {}
