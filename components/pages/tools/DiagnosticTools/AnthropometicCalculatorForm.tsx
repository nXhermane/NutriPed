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
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { icons } from "lucide-react-native";
import colors from "tailwindcss/colors";

export interface AnthropometricCalculatorFormProps {
  schema?: FormSchema;
  onSubmit?: boolean;
  onSucess?: boolean;
  handleSubmit: () => void;
  error?: string | null;
  zodSchema?: DynamicFormZodSchemaType;
  formRef: Ref<FormHandler<any>>;
  submitBtnLabel: string;
  submitBtnRightIcon: keyof typeof icons;
  title?: string;
}

export const AnthropometricCalcualtorForm: React.FC<
  AnthropometricCalculatorFormProps
> = ({
  formRef,
  onSubmit,
  submitBtnLabel,
  submitBtnRightIcon,
  schema,
  title,
  zodSchema,
  onSucess,
  handleSubmit,
  error,
}) => {
  const LucideIcon = icons[submitBtnRightIcon];
  return (
    <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
      {title && (
        <HStack className="items-center justify-between">
          <Heading className="font-h4 text-base font-medium text-typography-primary">
            {title}
          </Heading>
        </HStack>
      )}
      <KeyboardAwareScrollView>
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
          />
        )}
      </KeyboardAwareScrollView>
      <Button
        className={`h-v-10 rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"}`}
        onPress={handleSubmit}
      >
        {onSubmit ? (
          <ButtonSpinner
            size={"small"}
            className="data-[active=true]:text-primary-c_light"
          />
        ) : (
          <ButtonIcon as={LucideIcon} className="text-typography-primary" />
        )}
        <ButtonText className="font-h4 font-medium text-typography-primary data-[active=true]:text-primary-c_light">
          {submitBtnLabel}
        </ButtonText>
        {onSucess && (
          <ButtonIcon as={icons["Check"]} className="text-typography-primary" />
        )}
        {error && (
          <ButtonIcon as={icons["X"]} className="text-typography-primary" />
        )}
      </Button>
    </VStack>
  );
};
