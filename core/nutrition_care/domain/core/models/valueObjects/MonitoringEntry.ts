import { DomainDate, formatError, Guard, handleError, Result, SystemCode, UnitCode, ValueObject } from "@shared";
export enum MonitoringEntryType {
   ANTHROPOMETRIC = "anthropometric",
   BIOCHEMICAL = "biochemical",
   VITAL_SIGN = "vital_sign",
}
export enum MonitoredValueSource {
   CALCULATED = "calculated",
   MANUAL = "manual",
   IMPORTED = "imported",
}
export interface IMonitoringEntry {
   date: DomainDate;
   code: SystemCode;
   type: MonitoringEntryType;
   value: number;
   unit: UnitCode;
   source: MonitoredValueSource;
}
export interface CreateMonitoringEntry {
   date: string;
   type: MonitoringEntryType;
   code: string;
   value: number;
   unit: string;
   source: MonitoredValueSource;
}

export class MonitoringEntry extends ValueObject<IMonitoringEntry> {
   protected validate(props: Readonly<IMonitoringEntry>): void {
      if (Guard.isNegative(props.value).succeeded) {
         throw new Error("MonitoringEntry value can't be negative.");
      }
   }
   getType(): MonitoringEntryType {
      return this.props.type;
   }
   static create(createProps: CreateMonitoringEntry): Result<MonitoringEntry> {
      try {
         const dateRes = DomainDate.create(createProps.date);
         const unitRes = UnitCode.create(createProps.unit);
         const codeRes = SystemCode.create(createProps.code);
         const combinedRes = Result.combine([dateRes, unitRes, codeRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, MonitoringEntry.name));
         const props: IMonitoringEntry = {
            date: dateRes.val,
            type: createProps.type,
            code: codeRes.val,
            value: createProps.value,
            unit: unitRes.val,
            source: createProps.source,
         };
         return Result.ok(new MonitoringEntry(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
