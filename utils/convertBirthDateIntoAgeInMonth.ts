import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
} from "@/core/constants";

export function convertBirthDateIntoAgeInMonth(birthDate: Date) {
  const date = new Date();
  const diffInMs = date.getTime() - birthDate.getTime();
  const dayAfterBirthDay = diffInMs / (1000 * 60 * 60 * 24);
  const monthAfterBirthDay = dayAfterBirthDay / DAY_IN_MONTHS;
  const yearAfterBirthDay = dayAfterBirthDay / DAY_IN_YEARS;
  return {
    [AnthroSystemCodes.AGE_IN_DAY]: dayAfterBirthDay,
    [AnthroSystemCodes.AGE_IN_MONTH]: monthAfterBirthDay,
  };
}
