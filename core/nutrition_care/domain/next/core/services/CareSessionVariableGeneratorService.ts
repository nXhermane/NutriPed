import {
  AggregateID,
  DomainDateTime,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import { CarePhase, DailyCareRecord } from "../models";
import { ICareSessionVariableGeneratorService } from "./interfaces";
import {
  ConsecutiveVariableType,
  IComputedVariablePerformerACL,
  MedicalRecordVariableTransformerAcl,
} from "../ports";
import {
  admissionVariable,
  AdmissionVariable,
  AnthroSystemCodes,
  CARE_SESSION,
  ConsecutiveVariable,
  dailyVariable,
} from "@/core/constants";

export class CareSessionVariableGeneratorService
  implements ICareSessionVariableGeneratorService
{
  constructor(
    private readonly computedVariablePerformerAcl: IComputedVariablePerformerACL,
    private readonly medicalRecordVariableTransformerAcl: MedicalRecordVariableTransformerAcl
  ) {}
  async generate(
    patientId: AggregateID,
    currentCarePhase: CarePhase,
    currentDailyRecord: DailyCareRecord
  ): Promise<Result<Record<string, number | string>>> {
    try {
      const dynamicVariablesRes = this.generateDynamicCareSessionVariable(
        currentCarePhase,
        currentDailyRecord
      );

      if (dynamicVariablesRes.isFailure) {
        return Result.fail(
          formatError(
            dynamicVariablesRes,
            CareSessionVariableGeneratorService.name
          )
        );
      }

      const admissionAndCurrentDayRes =
        await this.generateAdmissionAndCurrentDayVariable(
          patientId,
          currentCarePhase.getProps().startDate,
          currentDailyRecord.getProps().date
        );

      if (admissionAndCurrentDayRes.isFailure) {
        return Result.fail(
          formatError(
            admissionAndCurrentDayRes,
            CareSessionVariableGeneratorService.name
          )
        );
      }

      const lastTwoDaysRes = await this.getRecordLastTwoDays(
        patientId,
        currentDailyRecord.getProps().date
      );

      if (lastTwoDaysRes.isFailure) {
        return Result.fail(
          formatError(lastTwoDaysRes, CareSessionVariableGeneratorService.name)
        );
      }

      const weightConsecutiveRes =
        await this.getWeightConsecutiveVariable(patientId);

      if (weightConsecutiveRes.isFailure) {
        return Result.fail(
          formatError(
            weightConsecutiveRes,
            CareSessionVariableGeneratorService.name
          )
        );
      }

      // // 5. Récupérer les variables calculées via le service de performance
      // const computedVariablesRes =
      //   await this.computedVariablePerformerAcl.computeVariables(
      //     patientId,
      //     currentDailyRecord.getProps().date
      //   );

      // if (computedVariablesRes.isFailure) {
      //   return Result.fail(
      //     formatError(
      //       computedVariablesRes,
      //       CareSessionVariableGeneratorService.name
      //     )
      //   );
      // }

      const allResults = Result.combine([
        dynamicVariablesRes,
        admissionAndCurrentDayRes,
        lastTwoDaysRes,
        weightConsecutiveRes,
        // computedVariablesRes, TODO: Demain je vais implementer cela.
      ]);

      if (allResults.isFailure) {
        return Result.fail(
          formatError(allResults, CareSessionVariableGeneratorService.name)
        );
      }

      // 7. Fusionner toutes les variables en un seul objet
      const combinedVariables = {
        ...dynamicVariablesRes.val,
        ...admissionAndCurrentDayRes.val,
        ...lastTwoDaysRes.val,
        ...weightConsecutiveRes.val,
        ...computedVariablesRes.val,
      };

      return Result.ok(combinedVariables);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private async getRecordLastTwoDays(
    patientId: AggregateID,
    currentDate: DomainDateTime
  ) {
    try {
      const prevDayDate = currentDate.removeDays(1);
      const beforePrevDayDate = prevDayDate.removeDays(1);
      const prevDayVariablesRes = await this.generateVariableByDate(
        patientId,
        prevDayDate
      );
      const beforePrevDayVariablesRes = await this.generateVariableByDate(
        patientId,
        beforePrevDayDate
      );
      const combinedRes = Result.combine([
        prevDayVariablesRes,
        beforePrevDayVariablesRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, CareSessionVariableGeneratorService.name)
        );
      }
      return Result.ok({
        ...Object.fromEntries(
          Object.entries(prevDayVariablesRes.val).map(([code, value]) => [
            dailyVariable(code, 0),
            value,
          ])
        ),
        ...Object.fromEntries(
          Object.entries(beforePrevDayVariablesRes.val).map(([code, value]) => [
            dailyVariable(code, 1),
            value,
          ])
        ),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async getWeightConsecutiveVariable(
    patientId: AggregateID
  ): Promise<
    Result<Record<ConsecutiveVariable<AnthroSystemCodes.WEIGHT>, number>>
  > {
    try {
      const codeRes = new SystemCode({ _value: AnthroSystemCodes.WEIGHT });
      return this.medicalRecordVariableTransformerAcl.getConsecutiveVariable(
        patientId,
        codeRes,
        ConsecutiveVariableType.ANTHROP,
        3
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async generateAdmissionAndCurrentDayVariable(
    patientId: AggregateID,
    admissionDate: DomainDateTime,
    currentDayDate: DomainDateTime
  ): Promise<
    Result<Record<`${string}` | AdmissionVariable<string>, number | string>>
  > {
    try {
      const admissionVariablesRes = await this.generateVariableByDate(
        patientId,
        admissionDate
      );
      const currentDayVariablesRes = await this.generateVariableByDate(
        patientId,
        currentDayDate
      );
      const combinedRes = Result.combine([
        admissionVariablesRes,
        currentDayVariablesRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, CareSessionVariableGeneratorService.name)
        );
      }
      return Result.ok({
        ...currentDayVariablesRes.val,
        ...Object.fromEntries(
          Object.entries(admissionVariablesRes.val).map(([code, value]) => [
            admissionVariable(code),
            value,
          ])
        ),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async generateVariableByDate(
    patientId: AggregateID,
    date: DomainDateTime
  ): Promise<Result<Record<string, number | string>>> {
    try {
      return this.medicalRecordVariableTransformerAcl.getVariableByDate(
        patientId,
        date
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private generateDynamicCareSessionVariable(
    carePhase: CarePhase,
    currentDailyJournal: DailyCareRecord
  ): Result<Record<string, number | string>> {
    try {
      return this.createActivePhaseResult(carePhase, currentDailyJournal);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Crée le résultat pour une phase active avec journal quotidien
   */
  private createActivePhaseResult(
    careSession: CarePhase,
    currentDailyJournal: DailyCareRecord
  ): Result<Record<string, number | string>> {
    const daysInPhase = this.calculateDaysInPhase(
      careSession.getProps().startDate,
      currentDailyJournal.getProps().date
    );

    return Result.ok({
      [CARE_SESSION.CURRENT_CARE_PHASE]: careSession.getCode(),
      [CARE_SESSION.DAYS_IN_PHASE]: daysInPhase,
    });
  }

  private calculateDaysInPhase(
    admissionDate: DomainDateTime,
    currentDate: DomainDateTime
  ): number {
    return currentDate.diffInDays(admissionDate);
  }
}
