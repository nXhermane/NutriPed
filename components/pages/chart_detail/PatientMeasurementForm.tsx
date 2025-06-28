import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import React, { Ref } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import colors from "tailwindcss/colors";
import { MeasurementFormSchema } from "@/src/hooks";
import { Plus } from "lucide-react-native";



export interface PatientMeasurementFormProps {
    schema?: MeasurementFormSchema,
    onSubmit: () => void,
    formRef: Ref<FormHandler<any>>
}
export const PatientMeasurementForm: React.FC<PatientMeasurementFormProps> = ({ formRef, onSubmit, schema }) => {


    return (<VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
        <HStack className="items-center justify-between">
            <Heading className="font-h4 text-base font-medium text-typography-primary">
                Données du patient
            </Heading>
        </HStack>

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            {!schema ? (
                <Center className="flex-1 bg-background-primary">
                    <Spinner size={"large"} color={colors.blue["600"]} />
                </Center>
            ) : (
                <DynamicFormGenerator
                    schema={[{ fields: schema?.fields||[], section: "" }]}
                    zodSchema={schema?.zodSchema}
                    ref={formRef}
                    className="p-0 px-0"
                />
            )}
        </KeyboardAwareScrollView>

        <Button
            className="h-v-10 rounded-xl bg-primary-c_light"
            onPress={onSubmit}
        >
            <ButtonIcon as={Plus} className="text-typography-primary" />
            <ButtonText className="font-h4 font-medium text-typography-primary">
                Ajouter mesure
            </ButtonText>
        </Button>
    </VStack>)
} 