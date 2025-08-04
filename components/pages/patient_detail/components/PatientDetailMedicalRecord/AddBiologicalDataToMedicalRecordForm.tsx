import {
  DynamicFormGenerator,
  DynamicFormZodSchemaType,
  FormHandler,
  FormSchema,
} from "@/components/custom";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Check, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { usePediatricApp } from "@/adapter";
import { DateManager } from "@/core/shared";
import {
  useAddDataToMedicalRecordModal,
  usePatientDetail,
} from "@/src/context/pages";
import { uiBus } from "@/uiBus";

export interface AddBiologicalDataToMedicalRecordFormProps {
  schema: FormSchema;
  zodValidation: DynamicFormZodSchemaType;
}
export const AddBiologicalDataToMedicalRecordForm: React.FC<
  AddBiologicalDataToMedicalRecordFormProps
> = ({ schema, zodValidation }) => {
  const { close } = useAddDataToMedicalRecordModal();
  const { patient } = usePatientDetail();
  const { medicalRecordService } = usePediatricApp();
  const formRef = useRef<FormHandler<any>>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const handleSubmitForm = async () => {
    setError(null);
    setIsSuccess(false);
    const data = await formRef.current?.submit();
    if (data) {
      const entries = Object.values(data);
      const result = await medicalRecordService.addData({
        medicalRecordId: patient.id,
        data: {
          biologicalData: entries.map(item => ({
            ...item,
            recordedAt: DateManager.formatDate(new Date()),
          })),
        },
      });
      if ("data" in result) {
        setIsSuccess(true);
        uiBus.emit("medical:update");
      } else {
        const _errorContent = JSON.parse(result.content);
        console.error(_errorContent);
        setError(_errorContent);
      }
    }
  };
  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView
        ScrollViewComponent={BottomSheetScrollView as any}
        showsVerticalScrollIndicator={false}
      >
        <DynamicFormGenerator
          schema={schema}
          className="bg-background-primary p-0 px-2 py-v-3"
          ref={formRef}
          zodSchema={zodValidation}
        />
      </KeyboardAwareScrollView>
      <HStack className="mb-4 h-fit w-full bg-background-primary px-4 py-4">
        <Button
          className={`h-v-10 w-full rounded-xl ${false ? "bg-red-500" : "bg-primary-c_light"}`}
          onPress={handleSubmitForm}
        >
          {false && (
            <ButtonSpinner
              size={"small"}
              className="data-[active=true]:text-primary-c_light"
            />
          )}
          <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
            Enregistrer
          </ButtonText>
          {false && <ButtonIcon as={Check} className="text-white" />}
          {false && <ButtonIcon as={X} className="text-white" />}
        </Button>
      </HStack>
    </BottomSheetScrollView>
  );
};
