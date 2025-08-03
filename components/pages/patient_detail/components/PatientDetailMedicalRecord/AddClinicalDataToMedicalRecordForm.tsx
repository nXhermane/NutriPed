import {
  DynamicFormGenerator,
  FormHandler,
  Loading,
} from "@/components/custom";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ClinicalSignReferenceDto } from "@/core/diagnostics";
import {
  useAddClinicalDataToMedicalRecord,
  useClinicalSignReferenceFormGenerator,
} from "@/src/hooks";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Check, X } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAddDataToMedicalRecordModal } from "../../context";

export interface AddClinicalDataToMedicalRecordFormProps {
  data: ClinicalSignReferenceDto[];
}

export const AddClinicalDataToMedicalRecordForm: React.FC<
  AddClinicalDataToMedicalRecordFormProps
> = ({ data }) => {
  const { close } = useAddDataToMedicalRecordModal();
  const {
    data: formData,
    variableUsageMap,
    onLoading: formOnLoading,
  } = useClinicalSignReferenceFormGenerator(data, false);
  const formRef = useRef<FormHandler<any>>(null);
  const { error, isSubmitting, isSuccess, submit } =
    useAddClinicalDataToMedicalRecord();
  const handleSubmitForm = async () => {
    const formDataRes = await formRef.current?.submit();
    await submit(formDataRes, variableUsageMap as any);
  };
  useEffect(() => {
    if (isSuccess) close();
  }, [isSuccess]);
  if (formOnLoading) return <Loading />;
  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      {formData && (
        <KeyboardAwareScrollView
          ScrollViewComponent={BottomSheetScrollView as any}
          showsVerticalScrollIndicator={false}
        >
          <DynamicFormGenerator
            schema={formData?.schema}
            className="bg-background-primary p-0 px-2 py-v-3"
            ref={formRef}
            zodSchema={formData.zodSchema}
          />
        </KeyboardAwareScrollView>
      )}
      <HStack className="mb-4 h-fit w-full bg-background-primary px-4 py-4">
        <Button
          className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"}`}
          onPress={handleSubmitForm}
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
    </BottomSheetScrollView>
  );
};
