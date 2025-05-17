import { Either, ExceptionBase, Result } from "@shared";
import { OrientationRefDto } from "../../../dtos";

export type GetOrientationRefResponse = Either<ExceptionBase | unknown, Result<OrientationRefDto[]>>;
