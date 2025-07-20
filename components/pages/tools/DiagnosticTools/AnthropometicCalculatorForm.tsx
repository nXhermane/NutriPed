import React, { Ref } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import {
  DynamicFormGenerator,
  DynamicFormZodSchemaType,
  FormHandler,
  FormSchema,
} from "@/components/custom";
import { icons } from "lucide-react-native";
import colors from "tailwindcss/colors";

export interface AnthropometricCalculatorFormProps {
  schema?: FormSchema;
  zodSchema?: DynamicFormZodSchemaType;
  formRef: Ref<FormHandler<any>>;
  title?: string;
  initialState?: Record<string, { value: any; error?: string }>;
}

export const AnthropometricCalcualtorForm: React.FC<
  AnthropometricCalculatorFormProps
> = ({ formRef, schema, title, zodSchema, initialState }) => {
  return (
    <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
      {title && (
        <HStack className="items-center justify-between">
          <Heading className="font-h4 text-base font-medium text-typography-primary">
            {title}
          </Heading>
        </HStack>
      )}
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {!schema ? (
          <Center className="flex-1 bg-background-primary">
            <Spinner size={"large"} color={colors.blue["600"]} />
          </Center>
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
    </VStack>
  );
};
