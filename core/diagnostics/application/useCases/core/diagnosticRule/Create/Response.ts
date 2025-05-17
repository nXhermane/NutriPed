import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateDiagnosticRuleResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>;
