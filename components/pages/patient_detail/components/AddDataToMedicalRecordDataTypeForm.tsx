import { Text } from "@/components/ui/text";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { AddAnthropometricDataToMedicalRecord } from "./AddAnthropometricDataToMedicalRecord";

export interface AddDataToMedicalRecordDataTypeFormProps {}

export const AddDataToMedicalRecordDataTypeForm: React.FC<
  AddDataToMedicalRecordDataTypeFormProps
> = ({}) => {
  const router = useRoute();
  console.log(router.params);
  const render = () => {
    switch (router.params["tag"]) {
      case "anthropometric": {
        return (
          <React.Fragment>
            <AddAnthropometricDataToMedicalRecord />
          </React.Fragment>
        );
      }
      case "clinical": {
        return <React.Fragment></React.Fragment>;
      }
      case "biological": {
        return <React.Fragment></React.Fragment>;
      }
      case "complication": {
        return <React.Fragment></React.Fragment>;
      }
      default: {
        return (
          <React.Fragment>
            <Text>This data type is not supported</Text>
          </React.Fragment>
        );
      }
    }
  };
  return <React.Fragment>{render()}</React.Fragment>;
};
