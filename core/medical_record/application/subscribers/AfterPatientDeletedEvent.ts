/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindEventHandler, DomainEventMessage, EventHandler, EventHandlerExecutionFailed, UseCase } from "@shared";
import { PatientDeletedData, PatientDeletedEvent } from "../../../patient";
import { DeleteMedicalRecordRequest, DeleteMedicalRecordResponse } from "../useCases";

@DomainEventMessage("After Patient Deleted, On MedicalRecord Bc, Delete associated Medical Record", true)
export class AfterPatientDeletedMedicalRecordHandler extends EventHandler<PatientDeletedData, PatientDeletedEvent> {
   constructor(private readonly deleteUseCase: UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>, priority?: number) {
      super(priority);
   }
   async execute(event: PatientDeletedEvent): Promise<void> {
      await this.onPatientDeletedEvent(event.data);
   }
   private async onPatientDeletedEvent(eventData: PatientDeletedData) {
         const deleteMedicalRecordRes = await this.deleteUseCase.execute({patientOrMedicalRecordId: eventData.id });
         if (deleteMedicalRecordRes.isLeft()) throw new EventHandlerExecutionFailed(JSON.stringify((deleteMedicalRecordRes.value as any)?.err));
       }
}
bindEventHandler(AfterPatientDeletedMedicalRecordHandler, PatientDeletedEvent);
