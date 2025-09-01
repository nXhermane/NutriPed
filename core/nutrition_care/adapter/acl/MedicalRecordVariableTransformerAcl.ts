import { DomainDateTime, Result, SystemCode } from "@/core/shared";
import { NextCore } from "../../domain";

export class MedicalRecordVariableTransformerAclImpl
  implements NextCore.MedicalRecordVariableTransformerAcl
{
  async getVariableByDate(
    date: DomainDateTime
  ): Promise<Result<NextCore.MedicalRecordVariables>> {
    throw new Error("Method not implemented.");
  }
  async getConsecutiveVariable<T extends string>(
    code: SystemCode<T>,
    type: NextCore.ConsecutiveVariableType,
    counter: number
  ): Promise<Result<Record<`${T}_${number}`, number>>> {
    throw new Error("Method not implemented.");
  }
}
