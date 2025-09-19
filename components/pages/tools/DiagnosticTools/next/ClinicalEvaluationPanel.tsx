import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { useCallback, useRef, useState } from "react";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Check, Microscope, Plus, X } from "lucide-react-native";
import { ClinicalDataFieldSelectorModal } from "./ClinicalDataFieldSelectorModal";
import { DynamicFormGenerator, FakeBlur, FormHandler, Loading } from "@/components/custom";
import { useDataFields } from "@/src/hooks";
import { AggregateID } from "@/core/shared";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useDataFieldForm } from "@/src/hooks/app/useDataFieldForm";
import { AnthroSystemCodes } from "@/core/constants";
import { usePediatricApp } from "@/adapter";
import { ClinicalEvaluationResultDto } from "@/core/evaluation/application/dtos/next/clinical";

export interface ClinicalEvaluationPanelProps {

}

export const ClinicalEvaluationPanel: React.FC<ClinicalEvaluationPanelProps> = () => {
    const { diagnosticServices: { nextClinicalAnalysis } } = usePediatricApp()
    const { data, onLoading, error: loadingError, reload } = useDataFields()
    const [selectedFiels, setSelectedFields] = useState<AggregateID[]>([]);
    const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [onSubmit, setOnSubmit] = useState<boolean>(false);
    const [onSucess, setOnSucess] = useState<boolean>(false);
    const [clinicalEvaluationResult, setClinicalEvaluationResult] = useState<ClinicalEvaluationResultDto[]>([])
    const { formSchema } = useDataFieldForm(data.filter(field => selectedFiels.includes(field.id)), { withGeneralInfo: true });
    const formRef = useRef<FormHandler<any>>(null)


    const handleSubmitForm = useCallback(
        async () => {
            setOnSubmit(true);
            const formData = await formRef.current?.submit();
            if (formData) {
                const { age_in_day, sex, age_in_month, birthday, ...fieldData } = formData;
                const context = {
                    age_in_day, age_in_month, sex
                }
                const dataFieldsResponse = Object.entries(fieldData).map(([code, value]) => ({ value, code }))
                const response = await nextClinicalAnalysis.evaluate({
                    context: {
                        birthday, sex
                    }, data: dataFieldsResponse
                })
                if ('data' in response) {

                } else {
                    const _errorContent = JSON.parse(response.content);
                    setError(_errorContent);
                }

            }
            setOnSubmit(false);
        },
        [nextClinicalAnalysis],
    )

    if (onLoading || loadingError) return <Loading
        state={onLoading ? "loading" : loadingError ? "error" : 'empty'}
        onReload={reload}
    />

    return <React.Fragment>
        <VStack className="w-full flex-1 px-4">
            <VStack className="w-full flex-1 pt-5">
                <HStack className="mb-3 w-full items-center justify-between rounded-xl bg-background-secondary p-3">
                    <VStack className="w-[80%]">
                        <Heading className="font-h4 text-lg font-medium text-typography-primary">
                            Ajoutez un champs
                        </Heading>
                        <Text className="font-body text-xs font-normal text-typography-primary_light">
                            Sélectionnez les champs d'évaluation clinique que vous souhaitez remplir pour ce patient.
                        </Text>
                    </VStack>
                    <Button
                        className="h-fit rounded-full bg-primary-c_light p-0 px-2 py-2"
                        onPress={() => setShowSelectionModal(true)}
                    >
                        <ButtonIcon as={Plus} className="h-5 w-5 text-white" />
                    </Button>
                </HStack>

                <VStack className="rounded-xl bg-background-secondary p-3">
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        {...(selectedFiels.length > 2 && {
                            contentContainerClassName: "pb-16",
                        })}
                    >
                        <DynamicFormGenerator
                            schema={formSchema.schema}
                            zodSchema={formSchema.zod as any}
                            ref={formRef}
                            className="p-0 px-0"
                            onChange={() => {
                                console.log("hello")
                            }}
                        />
                    </KeyboardAwareScrollView>
                </VStack>
            </VStack>
        </VStack>
        {selectedFiels.length != 0 && (
            <HStack className="w-full overflow-hidden rounded-xl">
                <FakeBlur className="w-full px-8 py-v-4">
                    <Button
                        className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"}`}
                        onPress={handleSubmitForm}
                    >
                        {onSubmit ? (
                            <ButtonSpinner
                                size={"small"}
                                className="data-[active=true]:text-primary-c_light"
                            />
                        ) : (
                            <ButtonIcon as={Microscope} className="text-white" />
                        )}
                        <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                            Interpreter
                        </ButtonText>

                        {onSucess && <ButtonIcon as={Check} className="text-white" />}
                        {error && <ButtonIcon as={X} className="text-white" />}
                    </Button>
                </FakeBlur>
            </HStack>
        )}
        <ClinicalDataFieldSelectorModal fields={data} isVisible={showSelectionModal} onSelect={(id) => setSelectedFields(prev => [...prev, id])} selectedFields={selectedFiels} onClose={() => setShowSelectionModal(false)} />
    </React.Fragment>
}