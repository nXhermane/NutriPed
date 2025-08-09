import { CreateAnthropometricData } from "./../../../../domain";

export type NormalizeAnthropometricDataRequest = {
  anthropometricMeasures: CreateAnthropometricData["anthropometricMeasures"];
};
