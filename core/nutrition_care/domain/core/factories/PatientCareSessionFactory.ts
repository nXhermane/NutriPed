import { AggregateID, DomainDate, EntityPropsBaseType, Factory, formatError, GenerateUniqueId, handleError, Result, SystemCode } from "@shared";
import { ClinicalEvent, PatientCareSession, PatientCareSessionStatus, PatientCurrentState } from "../models";
import { ORIENTATION_REF_CODES } from "../../../../constants";
import { AppetiteTestResult } from "../../modules";
import { IPatientDailyJournalGenerator } from "../ports";

export interface CreatePatientCareSessionProps extends EntityPropsBaseType {
   patientId: AggregateID;
   appetiteTestResult: AppetiteTestResult;
   clinicalEvent: ClinicalEvent[];
}

export class PatientCareSessionFactory implements Factory<CreatePatientCareSessionProps, PatientCareSession> {
   constructor(private idGenerator: GenerateUniqueId, private readonly patientDailyJournalGenerator: IPatientDailyJournalGenerator) {}
   async create(props: CreatePatientCareSessionProps): Promise<Result<PatientCareSession>> {
      try {
         const startDate = new DomainDate();
         const defaultOrientation = {
            name: `Default Orientation(${ORIENTATION_REF_CODES.ORIENTED_TO_HOME})`,
            code: new SystemCode({ _value: ORIENTATION_REF_CODES.ORIENTED_TO_HOME }),
         };
         const patientCurrentStateRes = PatientCurrentState.create(
            {
               anthropometricData: {} as never,
               appetiteTestResult: {},
               biologicalData: {} as never,
               clinicalSignData: {} as never,
               complicationData: {},
            },
            this.idGenerator.generate().toValue(),
         );

         if (patientCurrentStateRes.isFailure) return Result.fail(formatError(patientCurrentStateRes, PatientCareSessionFactory.name));
         const patientCareSession = new PatientCareSession({
            id: this.idGenerator.generate().toValue(),
            props: {
               patientId: props.patientId,
               startDate,
               orientation: defaultOrientation,
               carePhases: [],
               dailyJournals: [],
               currentState: patientCurrentStateRes.val,
               status: PatientCareSessionStatus.NOT_READY,
            },
         });
         const result = this.patientDailyJournalGenerator.createDailyJournalIfNeeded(patientCareSession);
         if (result.isFailure) return Result.fail(formatError(result, PatientCareSessionFactory.name));
         patientCareSession.addAppetiteTestToJournal(props.appetiteTestResult);
         props.clinicalEvent.forEach(patientCareSession.addClinicalEventToJournal);
         return Result.ok(patientCareSession);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
