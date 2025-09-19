import { Loading } from "@/components/custom/Loading";
import {
  FormHandler,
  DynamicFormGenerator,
} from "@/components/custom/DynamicFormGenerator";
import { useWizardStep } from "@/components/custom/Wizard";
import { VStack } from "@/components/ui/vstack";
import {
  remapSignDataToClinicalSign,
  useClinicalReference,
  useClinicalSignReferenceFormGenerator,
} from "@/src/hooks";
import React, { useEffect, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export interface GlobalDiagnosticClinicalStepProps {}

export const GlobalDiagnosticClinicalStep: React.FC<
  GlobalDiagnosticClinicalStepProps
> = ({}) => {
  const { onPrev, onNext, data, error, setData, setError } = useWizardStep();
  const {
    data: clinicalRefDtos,
    onLoading,
    error: errorOnGetClinicalRefDtos,
  } = useClinicalReference();
  const {
    data: formData,
    variableUsageMap,
    onLoading: formOnLoading,
  } = useClinicalSignReferenceFormGenerator(clinicalRefDtos, false);
  const dynamicFormRef = useRef<FormHandler<any>>(null);

  useEffect(() => {
    onNext(async e => {
      setError(null);
      setData(null);
      const data = await dynamicFormRef.current?.submit();
      if (data) {
        setData({
          formState: dynamicFormRef.current?.getState(),
          data: remapSignDataToClinicalSign(data, variableUsageMap!),
        });
      } else {
        e.preventDefault();
        setError("Error de validation du formulaire");
      }
    });
    onPrev(e => {});
  }, [variableUsageMap]);

  if (onLoading || formOnLoading || !formData)
    return <Loading>Chargement...</Loading>;

  return (
    <VStack className="flex-1">
      <VStack className="mx-4 my-4 rounded-xl bg-background-secondary p-3">
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          {formData && (
            <DynamicFormGenerator
              ref={dynamicFormRef}
              schema={formData.schema}
              zodSchema={formData.zodSchema}
              className="p-0 px-0"
              initialState={data ? data.formState : undefined}
            />
          )}
        </KeyboardAwareScrollView>
      </VStack>
    </VStack>
  );
};
