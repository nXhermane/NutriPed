import { SystemCode } from "@shared";

export interface IDataFieldResponse {
  code: SystemCode;
  value: string | number | boolean;
  context: "admission" | "orientation" | "complication" | "custom";
}

// BETA: Sera integrer dans la version suivante pour ameliorer et faciliter l'implementation des autres functions. Elle fait partir aussi des current State
