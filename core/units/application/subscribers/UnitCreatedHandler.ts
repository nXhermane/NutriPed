import { UnitCreatedData, UnitCreatedEvent } from "./../../domain";
import { bindEventHandler, DomainEventMessage, EventHandler } from "domain-eventrix";

@DomainEventMessage("After Unit Created Event ...", true)
export class UnitCreatedHandler extends EventHandler<UnitCreatedData, UnitCreatedEvent> {
   execute(event: UnitCreatedEvent): void | Promise<void> {
console.log("Event Executed",event)
   }
}

bindEventHandler(UnitCreatedHandler,UnitCreatedEvent)