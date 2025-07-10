import { handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { OrientPatientRequest } from "./Request";
import { OrientPatientResponse } from "./Response";
import { OrientRequest, OrientResponse } from "../../../orientations";
import {
  APPETITE_TEST_CODES,
  APPETITE_TEST_RESULT_CODES,
  IPatientDailyJournalGenerator,
  PatientCareSession,
  PatientCareSessionRepository,
} from "../../../../../domain";
import {
  AnthroSystemCodes,
  AnthroSystemDefaultValue,
  CLINICAL_SIGNS,
  COMPLICATION_CODES,
  TREATMENT_HISTORY_VARIABLES_CODES,
} from "../../../../../../constants";
type PreviousTreatment =
  | "ORIENTATION_HOME"
  | "ORIENTATION_CRENAM"
  | "ORIENTATION_CNT"
  | "ORIENTATION_CNA";
type PatientOrientationContext = {
  [x: string]: number | APPETITE_TEST_RESULT_CODES | PreviousTreatment;
};
export class OrientPatientUseCase
  implements UseCase<OrientPatientRequest, OrientPatientResponse>
{
  constructor(
    private readonly orientUseCase: UseCase<OrientRequest, OrientResponse>,
    private readonly dailyJournalGenerator: IPatientDailyJournalGenerator,
    private readonly repo: PatientCareSessionRepository
  ) {}
  async execute(request: OrientPatientRequest): Promise<OrientPatientResponse> {
    try {
      const patientCareSession = await this.repo.getByIdOrPatientId(
        request.patientIdOrPatientCareId
      );
      const result =
        this.dailyJournalGenerator.createDailyJournalIfNeeded(
          patientCareSession
        );
      if (result.isFailure) return left(result);
      if (patientCareSession.isNotReady())
        return left(
          Result.fail(
            "The Patient Care Session is not ready to make orientation."
          )
        );

      const patientContext =
        this.getPatientCurrentVariables(patientCareSession);
      const orientRequest = this.generateOrientRequest(patientContext);
      const orientPatientRes = await this.orientPatient(orientRequest);
      if (orientPatientRes.isFailure) return left(orientPatientRes);

      const orientPatientData = orientPatientRes.val;
      patientCareSession.changeOrientationResult({
        code: new SystemCode({ _value: orientPatientData.code }),
        name: orientPatientData.name,
      });

      await this.repo.save(patientCareSession);

      return right(Result.ok(orientPatientData));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private getPatientCurrentVariables(
    patientCareSession: PatientCareSession
  ): PatientOrientationContext {
    const patientCurrentState = patientCareSession.getCurrentState();
    const allPatientVariables = {
      ...patientCurrentState.getAnthroVariables(),
      ...patientCurrentState.getClinicalVariables(),
      ...patientCurrentState.getAppetiteTestVariables(),
      ...patientCurrentState.getComplicationVariables(),
      ...patientCurrentState.getOtherData(),
    };
    return allPatientVariables;
  }
  private generateOrientRequest(
    patientContext: PatientOrientationContext
  ): OrientRequest {
    return {
      [AnthroSystemCodes.AGE_IN_MONTH]: patientContext[
        AnthroSystemCodes.AGE_IN_MONTH
      ] as number,
      [AnthroSystemCodes.WEIGHT]: patientContext[
        AnthroSystemCodes.WEIGHT
      ] as number,
      [AnthroSystemCodes.MUAC]:
        (patientContext[AnthroSystemCodes.MUAC] as number) ||
        AnthroSystemDefaultValue[AnthroSystemCodes.MUAC],
      [AnthroSystemCodes.WFA]: patientContext[AnthroSystemCodes.WFA] as number,
      [AnthroSystemCodes.WFH_UNISEX_NCHS]: patientContext[
        AnthroSystemCodes.WFH_UNISEX_NCHS
      ] as number,
      [AnthroSystemCodes.WFLH_UNISEX]: patientContext[
        AnthroSystemCodes.WFLH_UNISEX
      ] as number,
      [CLINICAL_SIGNS.EDEMA]: patientContext[CLINICAL_SIGNS.EDEMA] as number,
      [APPETITE_TEST_CODES.CODE]: patientContext[
        APPETITE_TEST_CODES.CODE
      ] as APPETITE_TEST_RESULT_CODES,
      [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: patientContext[
        COMPLICATION_CODES.COMPLICATIONS_NUMBER
      ] as number,
      [TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT]: patientContext[
        TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT
      ] as PreviousTreatment,
    };
  }

  private async orientPatient(
    orientRequest: OrientRequest
  ): Promise<Result<{ code: string; name: string }>> {
    try {
      const orientResponse = await this.orientUseCase.execute(orientRequest);
      if (orientResponse.isRight()) {
        return Result.ok(orientResponse.value.val);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Result.fail((orientResponse.value as any).err);
      }
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
