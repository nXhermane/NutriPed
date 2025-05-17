import { Either, ExceptionBase, Result } from "@shared";
import { MilkSuggestionResultDto } from "../../../dtos";

export type SuggestMilkResponse = Either<ExceptionBase | unknown, Result<MilkSuggestionResultDto>>;
