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
  MONITORING_VALUE_SOURCE,
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

      const allResults = Result.combine([
        dynamicVariablesRes,
        admissionAndCurrentDayRes,
        lastTwoDaysRes,
        weightConsecutiveRes,
      ]);

      if (allResults.isFailure) {
        return Result.fail(
          formatError(allResults, CareSessionVariableGeneratorService.name)
        );
      }

      const contextVariables = {
        ...dynamicVariablesRes.val,
        ...admissionAndCurrentDayRes.val,
        ...lastTwoDaysRes.val,
        ...weightConsecutiveRes.val,
      };
      const computedVariablesRes = await this.generateComputedVariables(
        currentCarePhase,
        contextVariables
      );
      if (computedVariablesRes.isFailure) {
        return Result.fail(
          formatError(
            computedVariablesRes,
            CareSessionVariableGeneratorService.name
          )
        );
      }

      const combinedVariables = {
        ...contextVariables,
        ...computedVariablesRes.val,
      };

      return Result.ok(combinedVariables);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private async generateComputedVariables(
    carePhase: CarePhase,
    context: Record<string, string | number>
  ): Promise<Result<Record<string, number | string>>> {
    try {
      const codeRes = this.getCodeOfCalculcatedMonitoringParameters(carePhase);
      if (codeRes.isFailure) {
        return Result.fail(
          formatError(codeRes, CareSessionVariableGeneratorService.name)
        );
      }

      return this.computedVariablePerformerAcl.computeVariables(
        codeRes.val,
        context as any
      );
    } catch (e) {
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
  private getCodeOfCalculcatedMonitoringParameters(
    carePhase: CarePhase
  ): Result<SystemCode<string>[]> {
    try {
      const parameters = carePhase.getMonitoringParameters();
      const codes = parameters
        .filter(
          parameter =>
            parameter.element.getSource() === MONITORING_VALUE_SOURCE.CALCULATED
        )
        .map(parameter => parameter.element.unpack().code);
      return Result.ok(codes);
    } catch (e) {
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
