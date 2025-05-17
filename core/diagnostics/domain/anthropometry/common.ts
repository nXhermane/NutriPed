import { Sex } from "@shared";
import { AnthroSystemCodes } from "./models";

export type AnthropometricVariableObject = Partial<Record<AnthroSystemCodes, Sex | number>> &
   Required<Pick<Record<AnthroSystemCodes, Sex | number>, AnthroSystemCodes.SEX | AnthroSystemCodes.AGE_IN_DAY | AnthroSystemCodes.AGE_IN_MONTH>>;
