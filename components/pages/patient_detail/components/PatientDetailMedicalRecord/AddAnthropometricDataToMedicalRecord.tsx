import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useRef } from "react";
import { HStack } from "@/components/ui/hstack";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Check, X } from "lucide-react-native";
import { FormHandler } from "@/components/custom";
import { useAddAnthropometricMeasureToMedicalRecord } from "@/src/hooks";
<<<<<<< HEAD
import { AddAnthropometricDataToMedicalRecordForm } from "./AddAnthropometricDataToMedicalRecordForm";
import { useAddDataToMedicalRecordModal } from "@/src/context/pages";
=======
import { useAddDataToMedicalRecordModal } from "../../context";
import { AddAnthropometricDataToMedicalRecordForm } from "./AddAnthropometricDataToMedicalRecordForm";
>>>>>>> main

export interface AddAnthropometricDataToMedicalRecordProps {}

export const AddAnthropometricDataToMedicalRecord: React.FC<
  AddAnthropometricDataToMedicalRecordProps
> = ({}) => {
  const { close } = useAddDataToMedicalRecordModal();
  const { error, isSubmitting, isSuccess, submit } =
    useAddAnthropometricMeasureToMedicalRecord();
  const formRef = useRef<FormHandler<any>>(null);
  const handleFormSubmit = async () => {
    const data = await formRef.current?.submit();
    await submit(data);
  };
  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);
  return (
    <React.Fragment>
      <VStack className="flex-1 bg-background-primary pt-v-5">
        <AddAnthropometricDataToMedicalRecordForm formRef={formRef} />
        <HStack className="w-full px-8 py-4">
          <Button
            className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"}`}
            onPress={handleFormSubmit}
          >
            {isSubmitting && (
              <ButtonSpinner
                size={"small"}
                className="data-[active=true]:text-primary-c_light"
              />
            )}
            <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
              Enregistrer
            </ButtonText>
            {isSuccess && <ButtonIcon as={Check} className="text-white" />}
            {error && <ButtonIcon as={X} className="text-white" />}
          </Button>
        </HStack>
      </VStack>
    </React.Fragment>
  );
};
