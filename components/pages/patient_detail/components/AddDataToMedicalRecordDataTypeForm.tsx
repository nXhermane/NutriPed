import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { useRoute } from "@react-navigation/native";
import React from "react";

export interface AddDataToMedicalRecordDataTypeFormProps {}

export const AddDataToMedicalRecordDataTypeForm: React.FC<
  AddDataToMedicalRecordDataTypeFormProps
> = ({}) => {
  const router = useRoute();
  console.log(router.params);
  return (
    <React.Fragment>
      <Center className="flex-1">
        <Text>Center</Text>
      </Center>
    </React.Fragment>
  );
};
