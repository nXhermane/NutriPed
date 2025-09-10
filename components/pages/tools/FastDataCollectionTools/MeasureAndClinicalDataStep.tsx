import {
  DynamicFormGenerator,
  DynamicFormZodSchemaType,
  FormHandler,
  FormSchema,
  Loading,
  useWizardStep,
} from "@/components/custom";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  DiagnosticDataFormSchema,
  DiagnosticDataFormZodSchema,
} from "@/src/constants/ui";
import React, { Ref, useEffect, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export function MeasureAndClinicalDataStep() {
  const {
    onNext,
    onPrev,
    setError,
    setData,
    data: wizardData,
  } = useWizardStep();
  const formRef = useRef<FormHandler<any>>(null);
  useEffect(() => {
    onNext(async e => {
      setError(null);
      setData(null);
      const data = await formRef.current?.submit();
      if (data) {
        setData({
          formState: formRef.current?.getState(),
          data: data,
        });
        console.log(data);
      } else {
        e.preventDefault();
        setError("Erreur lors de la validation du formulaire.");
      }
    });
    onPrev(e => {});
  }, [onNext, onPrev]);
  return (
    <VStack className="flex-1 px-4">
      <DiagnosticDataCollectionForm
        formRef={formRef}
        schema={DiagnosticDataFormSchema}
        zodSchema={DiagnosticDataFormZodSchema as any}
        initialState={wizardData?.formState}
      />
    </VStack>
  );
}

interface DiagnosticDataCollectionFormProps {
  schema?: FormSchema;
  zodSchema?: DynamicFormZodSchemaType;
  formRef: Ref<FormHandler<any>>;
  title?: string;
  initialState?: Record<string, { value: any; error?: string }>;
}

const DiagnosticDataCollectionForm = ({
  formRef,
  initialState,
  schema,
  title,
  zodSchema,
}: DiagnosticDataCollectionFormProps) => {
  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      {!schema ? (
        <Loading />
      ) : (
        <DynamicFormGenerator
          schema={schema}
          zodSchema={zodSchema}
          ref={formRef}
          className="p-0 px-0"
          initialState={initialState}
        />
      )}
    </KeyboardAwareScrollView>
  );
};
