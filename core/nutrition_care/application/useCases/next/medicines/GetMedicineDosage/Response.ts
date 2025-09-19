import { NextMedicinesDto } from "@/core/nutrition_care/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetMedicineDosageResponse = Either<
  ExceptionBase | unknown,
  Result<NextMedicinesDto.MedicationDosageResultDto>
>;
