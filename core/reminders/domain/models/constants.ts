export enum ReminderTriggerType {
  INTERVAL = 'interval',
  DATE_TIME = 'date_time',
  RECURRING = 'recurring',
}
export enum RECURRING_FREQUENCY {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}
export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
