import { NextClinicalDtos } from "@/core/evaluation/application/dtos";
import { Sex } from "@/core/shared";

export type MakeClinicalInterpretationRequest = {
  data: NextClinicalDtos.ClinicalEvaluationResultDto[];
  context: {
    birthday: string;
    sex: Sex;
  };
};
